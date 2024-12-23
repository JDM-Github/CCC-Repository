import React from "react";
import Modal from "react-modal";

const ViewModal = ({ isOpen, onRequestClose, requirement }) => {
	const { attachedFile } = requirement || {}; // Destructure attachedFile from requirement
	// alert(attachedFile);
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="View Requirement"
			className="relative w-full max-w-lg mx-auto bg-white rounded-lg p-6 shadow-lg overflow-hidden"
			overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
		>
			<div className="w-full">
				<h2 className="text-2xl font-semibold text-blue-900 mb-4">
					View Requirement
				</h2>

				<div className="mb-4">
					<p className="text-lg font-medium text-gray-700">
						<strong>Title:</strong> {requirement?.title}
					</p>
				</div>

				<div className="mb-4">
					<p className="text-lg font-medium text-gray-700">
						<strong>Description:</strong> {requirement?.description}
					</p>
				</div>

				<div className="mb-6">
					<p className="text-lg font-medium text-gray-700">
						<strong>Schedule:</strong> {requirement?.schedule}
					</p>
				</div>

				{attachedFile && (
					<div className="mb-4">
						{attachedFile.match(/\.(jpeg|jpg|gif|png)$/) && (
							<img
								src={attachedFile}
								alt="Preview"
								className="mt-4 w-full max-h-64 object-cover rounded-lg"
							/>
						)}
					</div>
				)}

				<div className="flex justify-end">
					<button
						onClick={onRequestClose}
						className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition duration-300"
					>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ViewModal;
