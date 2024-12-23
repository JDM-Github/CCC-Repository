const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const multer = require("multer");

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
	cloud_name: "df3fvlapt",
	api_key: "196212842426657",
	api_secret: "PoX9mW6RavVmd74n_CbmG84FPqE",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function uploadToCloudinary(buffer) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ resource_type: "auto" }, (error, result) => {
				if (error) reject(error);
				else resolve(result.secure_url);
			})
			.end(buffer);
	});
}

class FileHandler {
	constructor() {
		this.router = express.Router();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post(
			"/upload-file",
			upload.single("file"),
			expressAsyncHandler(this.uploadImageToCloudinary)
		);
	}

	async uploadImageToCloudinary(req, res) {
		const serviceFile = req.file;

		try {
			const uploadedUrl = await uploadToCloudinary(serviceFile.buffer);
			console.log(uploadedUrl);
			res.send({
				success: true,
				uploadedDocument: uploadedUrl,
			});
		} catch (error) {
			res.send({
				success: false,
				message: `An error occurred while creating the request. ${error.message}`,
			});
		}
	}
}

const fileHandler = new FileHandler().router;
module.exports = fileHandler;