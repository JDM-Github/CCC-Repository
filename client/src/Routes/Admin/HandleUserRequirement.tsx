import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrashAlt,
	faBook,
	faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import RequestHandler from "../../Functions/RequestHandler";
import { toast } from "react-toastify";

const RequirementDetailModal = ({ requirement, isOpen, closeModal }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
				<div className="text-center mb-4">
					<h1 className="text-2xl font-semibold text-gray-800">
						Requirement Details
					</h1>
					<p className="text-lg text-gray-600 mt-1">
						Category:{" "}
						<span className="font-medium text-blue-600">
							{requirement.category}
						</span>
					</p>
				</div>

				<div className="mb-6">
					<h2 className="text-xl font-semibold text-gray-800">
						Requirement Title: {requirement.Requirement.title}
					</h2>
					<p className="mt-1 text-sm text-gray-600">
						<strong>Description:</strong>{" "}
						{requirement.Requirement.description}
					</p>
					<p className="mt-1 text-sm text-gray-600">
						<strong>Schedule:</strong>{" "}
						{new Date(
							requirement.Requirement.schedule
						).toLocaleString()}
					</p>

					{/* Image with Scrollable Content */}
					<div className="mt-4 overflow-y-auto max-h-80">
						<img
							src={requirement.attachedFile}
							alt="Requirement Image"
							className="w-full h-auto max-h-100 object-contain rounded-md shadow-md"
						/>
					</div>
				</div>

				<div className="bg-green-500 text-white text-center py-2 rounded-lg">
					<p className="font-semibold text-lg">
						Status: {requirement.status}
					</p>
				</div>

				<div className="bg-gray-50 mt-6 p-4 rounded-lg shadow-md">
					<h3 className="text-lg font-semibold text-gray-800">
						User Information
					</h3>
					<p className="mt-1 text-sm text-gray-600">
						<strong>Name:</strong> {requirement.User.name}
					</p>
					<p className="mt-1 text-sm text-gray-600">
						<strong>Email:</strong> {requirement.User.email}
					</p>
					<p className="mt-1 text-sm text-gray-600">
						<strong>Student ID:</strong>{" "}
						{requirement.User.student_id}
					</p>
				</div>

				{/* Close Button */}
				<div className="mt-4 text-center">
					<button
						onClick={closeModal}
						className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

const HandleUserRequirements = () => {
	const [selectedCategory, setSelectedCategory] = useState("Dropping");
	const [filterStatus, setFilterStatus] = useState("All");
	// const [allRequirements, setAllRequirements] = useState<any>([]);
	const [filteredRequirements, setFilteredRequirements] = useState<any>([]);
	const fetchAllRequirements = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/uploads",
				{
					category: selectedCategory,
				}
			);
			if (data.success) {
				// setAllRequirements(data.uploadedFiles);
				setFilteredRequirements(
					data.uploadedFiles.filter((req) =>
						filterStatus === "All"
							? true
							: req.status === filterStatus
					)
				);
			} else {
				toast.error(data.message || "Failed to fetch requirement.");
			}
		} catch (error) {
			toast.error("Error fetching requirement.");
		}
	};

	useEffect(() => {
		fetchAllRequirements();
	}, [selectedCategory, filterStatus]);

	const handleUpdateStatus = async (id, status) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to ${status} this requirement?`
		);
		if (!confirmDelete) return;

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/update-status",
				{
					id,
					status,
				}
			);
			if (data.success) {
				toast.success("User requirement status updated successfully.");
				fetchAllRequirements();
			} else {
				toast.error(data.message || "Failed to update status.");
			}
		} catch (error) {
			toast.error("Error updating status.");
		}
	};
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
	const handleViewRequirement = (requirement) => {
		setSelectedRequirement(requirement);
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="flex bg-gray-100 min-h-screen p-6">
			{/* Sidebar for categories */}
			<div className="w-1/4 bg-white rounded-lg shadow-lg p-6 mr-6">
				<h2 className="text-xl font-semibold text-blue-900 mb-6">
					Categories
				</h2>
				<ul className="space-y-4">
					{[
						{ name: "Dropping", icon: faTrashAlt },
						{ name: "Clearance", icon: faBook },
						{ name: "Graduation", icon: faGraduationCap },
					].map((category) => (
						<li
							key={category.name}
							className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
								selectedCategory === category.name
									? "bg-blue-900 text-white shadow-xl hover:bg-blue-900"
									: "bg-gray-50 hover:bg-blue-100"
							}`}
							onClick={() => setSelectedCategory(category.name)}
						>
							<div className="flex items-center space-x-3">
								<FontAwesomeIcon
									icon={category.icon}
									className={`${
										selectedCategory === category.name
											? "text-white"
											: "text-blue-900"
									}`}
									size="lg"
								/>
								<span className="font-medium text-sm">
									{category.name}
								</span>
							</div>
						</li>
					))}
				</ul>
			</div>

			{/* Content Area */}
			<div className="w-3/4 bg-white rounded-lg shadow-lg p-6">
				{/* Header */}
				<h2 className="text-2xl font-semibold text-white mb-6 bg-blue-900 p-4 rounded-lg shadow-sm">
					{selectedCategory} User Requirements
				</h2>

				{/* Filter Dropdown */}
				<div className="mb-3 flex justify-between items-center">
					<span className="text-gray-700 font-medium text-lg">
						Filter Requirements
					</span>
					<div className="flex items-center">
						<label className="mr-3 text-gray-600 font-medium">
							Status:
						</label>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="All">All</option>
							<option value="Pending">Pending</option>
							<option value="Approved">Approved</option>
							<option value="Rejected">Rejected</option>
						</select>
					</div>
				</div>

				{/* Requirements List */}
				<div className="space-y-4">
					{filteredRequirements.map((req) => (
						<div
							key={req.id}
							className="p-5 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 hover:border-blue-500 border-gray-200"
						>
							<div className="flex justify-between items-center">
								<div>
									<h3 className="font-semibold text-lg text-blue-900 mb-2">
										{req.User.name}
									</h3>
									<p className="text-sm text-gray-600">
										Requirement:{" "}
										<span className="font-medium text-blue-700">
											{req.Requirement.title}
										</span>
									</p>
									<p className="text-sm text-gray-600">
										Submitted On:{" "}
										<span className="font-medium">
											{req.createdAt}
										</span>
									</p>
									<p
										className={`text-sm font-semibold mt-2 ${
											{
												Pending: "text-yellow-500",
												Approved: "text-green-500",
												Rejected: "text-red-500",
											}[req.status]
										}`}
									>
										Status: {req.status}
									</p>
								</div>

								{/* Action Buttons */}
								<div className="flex space-x-3">
									<button
										className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-500 transition"
										onClick={() =>
											handleViewRequirement(req)
										}
									>
										View
									</button>
									{req.status == "Pending" && (
										<>
											<button
												className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-green-500 transition"
												onClick={() =>
													handleUpdateStatus(
														req.id,
														"Approved"
													)
												}
											>
												Approve
											</button>
											<button
												className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-red-500 transition"
												onClick={() =>
													handleUpdateStatus(
														req.id,
														"Rejected"
													)
												}
											>
												Reject
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<RequirementDetailModal
				requirement={selectedRequirement}
				isOpen={isModalOpen}
				closeModal={closeModal}
			/>
		</div>
	);
};

export default HandleUserRequirements;
