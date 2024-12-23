const express = require("express");
const {
	User,
	UploadFiles,
	Requirement,
	Announcement,
	Notification,
} = require("./models");
const { Op } = require("sequelize");

const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		if (user) {
			if (user.password !== password)
				return res.send({ success: false, message: "MALI PASSWORD" });

			return res.send({ success: true, message: "SUCCESS", user: user });
		}

		return res.send({ success: false, message: "WLANG ACCOUNT" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve users" });
	}
});

router.post("/register", async (req, res) => {
	try {
		const { student_id, email, password, name } = req.body;
		await User.create({ email, password, name, student_id });
		res.send({ success: true, message: "SUCCESS" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create user" });
	}
});

router.post("/get-all-dashboard", async (req, res) => {
	try {
		const totalUsers = await User.count();
		const activeUsers = await User.count({
			where: { isActive: true },
		});
		const newSignUps = await User.count({
			where: {
				createdAt: {
					[Op.gte]: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
				},
			},
		});
		const postedAnnouncements = await Announcement.count();
		const pendingReview = await UploadFiles.count({
			where: {
				status: "Pending",
			},
		});
		const approvedReview = await UploadFiles.count({
			where: {
				status: "Approved",
			},
		});
		res.send({
			success: true,
			data: {
				totalUsers,
				activeUsers,
				newSignUps,
				postedAnnouncements,
				pendingReview,
				approvedReview,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Failed to retrieve dashboard",
		});
	}
});

router.post("/get-all-announcements", async (req, res) => {
	try {
		const announcements = await Announcement.findAll();

		if (announcements.length > 0) {
			res.send({
				success: true,
				announcements,
			});
		} else {
			res.send({
				success: true,
				announcements: [],
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Failed to retrieve announcements",
		});
	}
});

router.post("/get-all-notifications", async (req, res) => {
	try {
		const { userId } = req.body;
		const notifications = await Notification.findAll({ userId });

		if (notifications.length > 0) {
			res.send({
				success: true,
				notifications,
			});
		} else {
			res.send({
				success: true,
				notifications: [],
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Failed to retrieve notifications",
		});
	}
});

router.post("/post-announcement", async (req, res) => {
	try {
		const { type, title, description } = req.body;
		if (!type || !title || !description) {
			return res.status(400).json({ error: "All fields are required." });
		}
		const newAnnouncement = await Announcement.create({
			type,
			title,
			description,
		});
		res.status(201).json({
			success: true,
			announcement: newAnnouncement,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Failed to post announcement",
		});
	}
});

router.post("/get-all-recent-user", async (req, res) => {
	try {
		const users = await User.findAll({ limit: 5 });
		res.send({ success: true, users });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Failed to retrieve users",
		});
	}
});

router.post("/requirements", async (req, res) => {
	try {
		const { category } = req.body;
		const requirements = await Requirement.findAll({ where: { category } });
		res.send({ success: true, requirements });
	} catch (error) {
		console.error("Error fetching requirements:", error);
		res.status(500).json({
			success: false,
			message: "Error fetching requirements",
			error,
		});
	}
});

router.post("/user-requirements", async (req, res) => {
	try {
		const { category, userId } = req.body;
		const requirements = await Requirement.findAll();
		const groupedRequirements = {
			Dropping: [],
			Clearance: [],
			Graduation: [],
		};

		requirements.forEach((requirement) => {
			groupedRequirements[requirement.category].push({
				id: requirement.id,
				title: requirement.title,
				description: requirement.description,
				attachedFile: requirement.attachedFile,
				schedule: requirement.schedule,
			});
		});

		const uploadFiles = await UploadFiles.findAll({
			where: { userId, requirementId: requirements.map((r) => r.id) },
		});

		const uploadStatuses = {
			Dropping: groupedRequirements.Dropping.map((requirement) => {
				const status = uploadFiles.find(
					(file) => file.requirementId === requirement.id
				);
				return {
					status: status ? status.status : "pending",
					date: status ? status.updatedAt : null,
				};
			}),
			Clearance: groupedRequirements.Clearance.map((requirement) => {
				const status = uploadFiles.find(
					(file) => file.requirementId === requirement.id
				);
				return {
					status: status ? status.status : "pending",
					date: status ? status.updatedAt : null,
				};
			}),
			Graduation: groupedRequirements.Graduation.map((requirement) => {
				const status = uploadFiles.find(
					(file) => file.requirementId === requirement.id
				);
				return {
					status: status ? status.status : "pending",
					date: status ? status.updatedAt : null,
				};
			}),
		};

		res.send({
			success: true,
			requirements: groupedRequirements,
			uploadStatuses,
		});
	} catch (error) {
		console.error("Error fetching requirements:", error);
		res.status(500).json({
			success: false,
			message: "Error fetching requirements",
			error,
		});
	}
});

// upload-requirements
router.post("/upload-requirements", async (req, res) => {
	const { id, attachedFile, userId, category } = req.body;
	try {
		let user = await UploadFiles.findOne({
			where: { requirementId: id, userId },
		});
		if (!user) {
			user = await UploadFiles.create({
				userId,
				requirementId: id,
				attachedFile,
				category,
				status: "Pending",
			});
			return res.status(201).json({
				success: true,
				message: "New user created and file uploaded.",
			});
		}
		await user.update({
			attachedFile,
			category,
		});
		return res
			.status(200)
			.json({ success: true, message: "File updated successfully." });
	} catch (error) {
		console.error("Error uploading requirement: ", error);
		return res
			.status(500)
			.json({ success: false, error: "Failed to upload requirement" });
	}
});

router.post("/create-requirement", async (req, res) => {
	const {
		category,
		title,
		description,
		schedule,
		attachedFile = "",
	} = req.body;

	try {
		const newRequirement = await Requirement.create({
			category,
			title,
			description,
			schedule,
			attachedFile,
		});
		return res
			.status(201)
			.json({ success: true, requirement: newRequirement });
	} catch (error) {
		console.error("Error creating requirement: ", error);
		return res
			.status(500)
			.json({ success: false, error: "Failed to create requirement" });
	}
});

router.post("/delete-requirements", async (req, res) => {
	try {
		const { id } = req.body;

		const requirement = await Requirement.findByPk(id);
		if (!requirement) {
			return res.status(404).json({ message: "Requirement not found" });
		}
		await requirement.destroy();
		return res
			.status(200)
			.json({ message: "Requirement deleted successfully" });
	} catch (error) {
		console.error("Error deleting requirement:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/uploads", async (req, res) => {
	try {
		const { category, status, requirementId } = req.body;
		const whereConditions = {};
		if (category) {
			whereConditions.category = category;
		}

		if (status) {
			whereConditions.status = status;
		}

		if (requirementId) {
			whereConditions.requirementId = requirementId;
		}

		const uploadedFiles = await UploadFiles.findAll({
			where: whereConditions,
			include: [
				{
					model: User,
				},
				{
					model: Requirement,
				},
			],
		});
		res.send({ success: true, uploadedFiles });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while fetching files",
		});
	}
});

router.post("/update-status", async (req, res) => {
	try {
		const { id, status } = req.body;

		const requirement = await UploadFiles.findByPk(id);
		if (!requirement) {
			return res
				.status(404)
				.json({ message: "User requirement not found" });
		}
		await Notification.create({
			userId: requirement.userId,
			title: `${status}`,
			description: `Your passed requirement has been ${status}`,
		});
		await requirement.update({ status });
		return res
			.status(200)
			.json({ message: "Requirement updated successfully" });
	} catch (error) {
		console.error("Error updating requirement:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/create-account-and-upload", async (req, res) => {
	// Hardcoded random values for testing
	const name = "John Doe";
	const student_id = "12345678"; // Random student ID
	const email = "johndoe@example.com"; // Random email
	const password = "password123"; // Random password
	const attachedFile = "uploads/samplefile.pdf"; // Random file path
	const category = "Dropping"; // Random category for file

	try {
		// Step 1: Create the User Account with hardcoded data
		// const newUser = await User.create({
		// 	name,
		// 	student_id,
		// 	email,
		// 	password, // Note: Password should ideally be hashed in a real app
		// });

		// Step 2: Create the Upload File Record using the newly created user's ID
		const newUpload = await UploadFiles.create({
			userId: "1029749910251012097", // Use the ID of the newly created user
			requirementId: "1029749702984499201", // Use requirementId = 1 for testing purposes
			attachedFile, // Use the mock file path
			category, // Use the mock category
		});

		// Respond with success and details
		res.status(201).json({
			message: "Account created and file uploaded successfully.",
			file: newUpload,
		});
	} catch (error) {
		console.error("Error creating account and uploading file:", error);
		res.status(500).json({
			message:
				"An error occurred while creating account and uploading file.",
		});
	}
});

router.get("/requirements", async (req, res) => {
	try {
		const requirements = await User.findAll();
		res.send({ success: true, requirements });
	} catch (error) {
		console.error("Error fetching requirements:", error);
		res.status(500).json({
			success: false,
			message: "Error fetching requirements",
			error,
		});
	}
});

router.post("/sample", async (req, res) => {
	try {
		// const users = await User.findAll();
		// res.status(200).json(users);
		res.send({ success: true, message: "pogi ako" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve users" });
	}
});

router.get("/get", async (req, res) => {
	try {
		// const users = await User.findAll();
		// res.status(200).json(users);
		res.send("BOBO");
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve users" });
	}
});

router.post("/get-all-submit", async (req, res) => {
	try {
		// const users = await User.findAll();
		// res.status(200).json(users);
		res.send({ success: true, message: "YOUGET AKK SUBMIT" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve users" });
	}
});

// router.post("/create-requirement", async (req, res) => {
// 	try {
// 		const { title, description } = req.body;
// 		await Requirement.create(title, description);
// 		res.send({
// 			success: true,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.send({
// 			success: false,
// 			message: "Failed to create requirement",
// 		});
// 	}
// });

router.post("/create-announcement", async (req, res) => {
	try {
		const { title, description } = req.body;
		await Announcement.create(title, description);
		res.send({
			success: true,
		});
	} catch (error) {
		console.error(error);
		res.send({
			success: false,
			message: "Failed to create announcement",
		});
	}
});

module.exports = router;
