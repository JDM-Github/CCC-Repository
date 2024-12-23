import React, { useEffect, useState } from "react";
import RequestHandler from "../../Functions/RequestHandler";
import { toast } from "react-toastify";

const HomePage = () => {
	// const recentUsers = [
	// 	{ username: "johndoe", date: "2024-12-14 10:32 AM" },
	// 	{ username: "janedoe", date: "2024-12-14 11:45 AM" },
	// 	{ username: "marysmith", date: "2024-12-13 09:20 AM" },
	// 	{ username: "bobbrown", date: "2024-12-12 03:15 PM" },
	// 	{ username: "alicejohnson", date: "2024-12-12 02:10 PM" },
	// ];
	const [announcements, setAnnouncements] = useState<any>([]);
	const [recentUser, setRecentUser] = useState<any>([]);
	const [dashboardData, setDashboardData] = useState({
		totalUsers: 0,
		activeUsers: 0,
		newSignUps: 0,
		postedAnnouncements: 0,
		pendingReview: 0,
		approvedReview: 0,
	});
	const fetchRecentUser = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get-all-recent-user"
			);
			if (data.success) {
				setRecentUser(data.users);
			} else {
				toast.error(data.message || "An Error has occurred.");
			}
		} catch (error) {
			toast.error("Error has occurred");
		}
	};
	const fetchDashboardData = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get-all-dashboard"
			);
			if (data.success) {
				setDashboardData(data.data);
			} else {
				toast.error(
					data.message ||
						"An error occurred while fetching dashboard data."
				);
			}
		} catch (error) {
			toast.error("Error fetching dashboard data");
		}
	};
	const fetchAnnouncements = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/get-all-announcements"
			);
			if (data.success) {
				setAnnouncements(data.announcements);
			} else {
				toast.error(data.message || "Failed to fetch announcements.");
			}
		} catch (error) {
			toast.error("Error fetching announcements.");
		}
	};

	useEffect(() => {
		fetchRecentUser();
		fetchDashboardData();
		fetchAnnouncements();
	}, []);

	return (
		<div className="min-h-screen p-6 flex justify-center">
			<div className="w-[90vw] flex space-x-6">
				<div className="flex-1">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-white border-t-4 border-blue-900 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-blue-100 p-2 rounded-full">
										<span className="text-xl">👥</span>
									</div>
									<h3 className="text-xl font-semibold text-blue-900">
										Total Users
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.totalUsers}
								</div>
								<p className="text-sm text-gray-600">
									How many users are in the system
								</p>
							</div>

							{/* Active Users Card */}
							<div className="bg-white border-t-4 border-green-500 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-green-100 p-2 rounded-full">
										<span className="text-xl">🔥</span>
									</div>
									<h3 className="text-xl font-semibold text-green-500">
										Active Users
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.activeUsers}
								</div>
								<p className="text-sm text-gray-600">
									Users currently active on the system
								</p>
							</div>

							{/* New Signups Card */}
							<div className="bg-white border-t-4 border-yellow-500 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-yellow-100 p-2 rounded-full">
										<span className="text-xl">📝</span>
									</div>
									<h3 className="text-xl font-semibold text-yellow-500">
										New Signups
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.newSignUps}
								</div>
								<p className="text-sm text-gray-600">
									Users who recently signed up
								</p>
							</div>

							{/* Posts Announcements Card */}
							<div className="bg-white border-t-4 border-red-500 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-red-100 p-2 rounded-full">
										<span className="text-xl">📢</span>
									</div>
									<h3 className="text-xl font-semibold text-red-500">
										Post Announcements
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.postedAnnouncements}
								</div>
								<p className="text-sm text-gray-600">
									Total posts made on the system
								</p>
							</div>

							{/* Pending Reviews Card */}
							<div className="bg-white border-t-4 border-purple-500 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-purple-100 p-2 rounded-full">
										<span className="text-xl">✔️</span>
									</div>
									<h3 className="text-xl font-semibold text-purple-500">
										Pending Requirements
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.pendingReview}
								</div>
								<p className="text-sm text-gray-600">
									Pending requirements to review
								</p>
							</div>

							{/* System Health Card */}
							<div className="bg-white border-t-4 border-green-600 p-4 rounded-lg shadow-md">
								<div className="flex items-center space-x-3 mb-4">
									<div className="bg-green-100 p-2 rounded-full">
										<span className="text-xl">⚙️</span>
									</div>
									<h3 className="text-xl font-semibold text-green-600">
										Approved Requirements
									</h3>
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-2">
									{dashboardData.approvedReview}
								</div>
								<p className="text-sm text-gray-600">
									Approved requirements
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white mt-8 p-6 rounded-lg shadow-lg max-h-100 overflow-auto">
						<h2 className="text-2xl font-semibold text-blue-900 mb-6 border-b-2 border-blue-100 pb-2">
							Recent Users
						</h2>
						<div className="space-y-4">
							{recentUser.slice(0, 5).map((user, index) => (
								<div
									key={index}
									className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center transition-all hover:bg-blue-50 hover:shadow-md cursor-pointer"
								>
									<div>
										<h3 className="font-semibold text-blue-900 text-lg">
											{user.name}
										</h3>
										<p className="text-sm text-gray-600">
											{user.date}
										</p>
									</div>
									<div className="text-blue-500 hover:text-blue-700">
										<span className="text-sm">Details</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="w-[25vw] bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold text-blue-900 mb-4">
						Announcements
					</h2>
					<div className="space-y-4">
						{announcements.length > 0 ? (
							announcements.map(
								(announcement: any, index: number) => (
									<div
										key={index}
										className={`p-4 rounded-lg shadow-sm ${
											announcement.type === "maintenance"
												? "bg-blue-50"
												: announcement.type ===
												  "new_feature"
												? "bg-yellow-50"
												: "bg-gray-50"
										}`}
									>
										<h3
											className={`text-lg font-semibold ${
												announcement.type ===
												"maintenance"
													? "text-blue-700"
													: announcement.type ===
													  "new_feature"
													? "text-yellow-600"
													: "text-gray-700"
											}`}
										>
											{announcement.title}
										</h3>
										<p className="text-sm text-gray-600">
											{announcement.description}
										</p>
										<p className="text-sm text-gray-600">
											{announcement.createdAt}
										</p>
									</div>
								)
							)
						) : (
							<p>No announcements available.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
