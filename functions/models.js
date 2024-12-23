require("dotenv").config();
const pg = require("pg");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
	"postgresql://adrian:voQZyu17ue5TmENpuBbd3w@desert-gnu-3557.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/submitease?sslmode=verify-full",
	{
		dialect: "postgres",
		dialectModule: pg,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
);

const User = sequelize.define(
	"User",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		student_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
);

// const UploadFiles = sequelize.define(
// 	"File",
// 	{
// 		userId: {
// 			type: DataTypes.INTEGER,
// 		},
// 		filename: {
// 			type: DataTypes.STRING,
// 		},
// 		isApproved: {
// 			// can also be considered pending
// 			type: DataTypes.BOOLEAN,
// 			defaultValue: false,
// 		},
// 		isRejected: {
// 			type: DataTypes.BOOLEAN,
// 			defaultValue: false,
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

const Announcement = sequelize.define("Announcement", {
	type: {
		type: DataTypes.STRING,
	},
	title: {
		type: DataTypes.STRING,
	},
	description: {
		type: DataTypes.STRING,
	},
});

const Notification = sequelize.define("Notification", {
	userId: {
		type: DataTypes.INTEGER,
	},
	type: {
		type: DataTypes.STRING,
		defaultValue: "Notification",
	},
	title: {
		type: DataTypes.STRING,
	},
	description: {
		type: DataTypes.STRING,
	},
});

const Admin = sequelize.define(
	"Admin",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		student_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

const Requirement = sequelize.define(
	"Requirement",
	{
		category: {
			type: DataTypes.STRING,
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		attachedFile: {
			type: DataTypes.STRING,
		},
		schedule: {
			type: DataTypes.DATE,
		},
	},
	{
		timestamps: true,
	}
);

const UploadFiles = sequelize.define(
	"File",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		requirementId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Requirements",
				key: "id",
			},
		},
		category: {
			type: DataTypes.STRING,
		},
		attachedFile: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

UploadFiles.belongsTo(User, {
	foreignKey: "userId",
});
UploadFiles.belongsTo(Requirement, {
	foreignKey: "requirementId",
});

module.exports = {
	sequelize,
	User,
	Admin,
	UploadFiles,
	Requirement,
	Announcement,
	Notification,
};
