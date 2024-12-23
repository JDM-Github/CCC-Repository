import React, { useState } from "react";
import { toast } from "react-toastify";
import RequestHandler from "../../Functions/RequestHandler";

function AddRequirementModal({ selectedCategory, onClose, fetchRequirements }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [schedule, setSchedule] = useState("");
	const [attachedFile, setAttachedFile] = useState(null);

	const handleFileChange = (e) => {
		setAttachedFile(e.target.files[0]);
	};

	const uploadFile = async () => {
		if (!attachedFile) return;

		let imageUrl = "";
		const formData = new FormData();
		formData.append("file", attachedFile);
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"file/upload-file",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (data.success) {
				imageUrl = data.uploadedDocument;
				return imageUrl;
			} else {
				toast.error("Error uploading file attachment.");
				return "";
			}
		} catch (error) {
			toast.error("Error uploading file attachment.");
			return "";
		}
		return "";
	};

	const handleSubmit = async () => {
		if (!title || !description) {
			toast.error("Please fill in all the fields!");
			return;
		}
		const imageUrl = await uploadFile();	
		try {
			const response = await RequestHandler.handleRequest(
				"post",
				"users/create-requirement",
				{
					category: selectedCategory,
					title,
					description,
					schedule,
					attachedFile: imageUrl,
				}
			);
			if (response.success) {
				toast.success("Requirement added successfully!");
				fetchRequirements();
				onClose();
			} else {
				toast.error(response.message || "Failed to add requirement.");
			}
		} catch (error) {
			toast.error("Error adding requirement.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative transform transition-all duration-300 ease-in-out ">
				<h3 className="text-xl font-semibold text-gray-800 mb-6">
					Add New Requirement
				</h3>
				<div className="mb-6">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700"
					>
						Title
					</label>
					<input
						id="title"
						type="text"
						className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
						placeholder="Enter requirement title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="schedule"
						className="block text-sm font-medium text-gray-700"
					>
						Schedule
					</label>
					<input
						id="schedule"
						type="date"
						className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
						value={schedule}
						onChange={(e) => setSchedule(e.target.value)}
						required
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700"
					>
						Description
					</label>
					<textarea
						id="description"
						className="mt-2 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
						placeholder="Enter the requirement description"
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

				<div className="mb-6">
					<label
						htmlFor="attachedFile"
						className="block text-sm font-medium text-gray-700"
					>
						Attach File (Optional)
					</label>
					<input
						id="attachedFile"
						type="file"
						className="mt-2 block w-full text-sm text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
						onChange={handleFileChange}
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 transition"
					>
						Add Requirement
					</button>
				</div>
			</div>
		</div>
	);
}

export default AddRequirementModal;
