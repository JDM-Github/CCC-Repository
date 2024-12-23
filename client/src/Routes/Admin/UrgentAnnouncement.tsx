import React, { useState } from "react";
import { toast } from "react-toastify";
import RequestHandler from "../../Functions/RequestHandler";

function UrgentAnnouncementModal({ onClose }) {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"users/post-announcement",
				{ type: "Urgent", title, description: message }
			);

			if (data.success) {
				toast.success("Urgent announcement posted successfully!");
			} else {
				toast.error(
					data.message || "Failed to post urgent announcement."
				);
			}
		} catch (error) {
			toast.error("Error posting urgent announcement.");
		}
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8 relative overflow-hidden">
				<h3 className="text-2xl font-semibold text-red-700 mb-6">
					Urgent Announcement
				</h3>

				<form>
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Title
						</label>
						<input
							type="text"
							className="w-full p-3 text-black border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
							placeholder="Enter urgent announcement title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Announcement Message
						</label>
						<textarea
							id="message"
							name="message"
							rows={4}
							className="w-full p-3 border text-black border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
							placeholder="Enter the urgent announcement details."
							onChange={(e) => setMessage(e.target.value)}
							required
						></textarea>
					</div>

					<div className="flex justify-end space-x-4 mt-4">
						<button
							type="button"
							className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UrgentAnnouncementModal;
