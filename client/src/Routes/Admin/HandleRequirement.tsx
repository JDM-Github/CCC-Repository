import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBook,
	faTrashAlt,
	faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import AddRequirementModal from "./AddRequirement.tsx";
import RequestHandler from "../../Functions/RequestHandler.js";
import { toast } from "react-toastify";
import ViewModal from "./ViewRequirement.tsx";

const HandlingRequirementsPage = () => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedRequirement, setSelectedRequirement] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState("Dropping");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [allRequirements, setAllRequirements] = useState<any>([]);
	const fetchAllRequirements = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/requirements",
				{
					category: selectedCategory,
				}
			);
			if (data.success) {
				setAllRequirements(data.requirements);
			} else {
				toast.error(data.message || "Failed to fetch requirement.");
			}
		} catch (error) {
			toast.error("Error fetching requirement.");
		}
	};

	const deleteRequirement = async (requirement) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this requirement?"
		);
		if (!confirmDelete) return;

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/delete-requirements",
				{
					id: requirement.id,
				}
			);
			if (data.success) {
				toast.success("Requirement deleted successfully.");
				fetchAllRequirements();
			} else {
				toast.error(data.message || "Failed to delete requirement.");
			}
		} catch (error) {
			toast.error("Error fetching requirement.");
		}
	};

	useEffect(() => {
		fetchAllRequirements();
	}, [selectedCategory]);

	const handleViewRequirement = (requirement) => {
		setSelectedRequirement(requirement);
		setIsViewModalOpen(true);
	};
	const handleDeleteRequirement = (requirement) => {
		deleteRequirement(requirement);
	};

	return (
		<div className="flex bg-gray-100 min-h-screen p-6">
			{/* Sidebar for categories */}
			<div className="w-1/4 bg-white rounded-lg shadow-lg p-6 mr-6">
				<h2 className="text-xl font-semibold text-blue-900 mb-6 border-b-2 border-gray-300 pb-2">
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

			<div className="w-3/4 bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-gray-900 mb-3 bg-gray-200 p-3 rounded-lg">
					{selectedCategory} Requirements
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{allRequirements.map((requirement) => (
						<div
							key={requirement.id}
							className="p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform"
						>
							<div className="flex justify-between items-center mb-4 pt-4">
								<h3 className="font-semibold text-blue-900 text-lg">
									{requirement.title}
								</h3>
								<div className="flex space-x-2">
									<button
										className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500"
										onClick={() =>
											handleViewRequirement(requirement)
										}
									>
										View
									</button>

									{/* <button
										className="px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800"
										onClick={() =>
											handleEditRequirement(
												requirement.id,
												prompt(
													"Edit Description",
													requirement.description
												),
												prompt(
													"Edit Schedule",
													requirement.schedule
												)
											)
										}
									>
										Edit
									</button> */}

									<button
										className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500"
										onClick={() =>
											handleDeleteRequirement(requirement)
										}
									>
										Delete
									</button>
								</div>
							</div>

							<p className="text-sm text-gray-600 mb-2">
								{requirement.description.slice(0, 30) + "..."}
							</p>
							<p className="text-sm text-gray-500">
								Schedule: {requirement.schedule}
							</p>
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="mt-6 flex justify-start">
					<button
						className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500"
						onClick={() => setIsModalOpen(true)}
					>
						Add Requirement
					</button>
					{isModalOpen && (
						<AddRequirementModal
							selectedCategory={selectedCategory}
							onClose={() => setIsModalOpen(false)}
							fetchRequirements={fetchAllRequirements}
						/>
					)}
				</div>
			</div>
			<ViewModal
				isOpen={isViewModalOpen}
				onRequestClose={() => setIsViewModalOpen(false)}
				requirement={selectedRequirement}
			/>
		</div>
	);
};

export default HandlingRequirementsPage;
