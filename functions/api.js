const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");
const bodyParser = require("body-parser");
const { sequelize } = require("./routers");
const userRoutes = require("./userRoute");
const fileHandler = require("./fileHandler");

const app = express();
const router = express.Router();
DEVELOPMENT = false;
if (DEVELOPMENT) {
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
			optionSuccessStatus: 200,
		})
	);
} else {
	app.use(cors());
}

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

router.use("/users", userRoutes);
router.use("/file", fileHandler);

router.get("/connect", async (req, res) => {
	try {
		// req.body;
		await sequelize.sync({ force: true });
		await sequelize.authenticate();
		res.status(200).json(
			"Connection to database has been established successfully."
		);
	} catch (error) {
		res.status(500).json("Unable to connect to the database:");
	}
});

router.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build"), "index.html");
});
app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
