import React, { useState } from "react";

const AnnouncementModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
				{/* Modal Header */}
				<h3 className="text-xl font-semibold text-blue-900 mb-4">
					Select Announcement Type
				</h3>

				{/* Announcement Buttons */}
				<div className="space-y-3">
					<button className="w-full px-4 py-3 text-white bg-red-600 rounded-md hover:bg-red-500 transition">
						Urgent
					</button>
					<button className="w-full px-4 py-3 text-white bg-yellow-600 rounded-md hover:bg-yellow-500 transition">
						Update
					</button>
					<button className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-500 transition">
						Normal
					</button>
				</div>

				{/* Close Button */}
				<button
					className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
					onClick={onClose}
				>
					&times;
				</button>
			</div>
		</div>
	);
};

export default AnnouncementModal;
