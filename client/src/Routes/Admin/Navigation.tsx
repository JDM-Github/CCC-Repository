import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faTasks,
	faBullhorn,
	faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import UrgentAnnouncementModal from "./UrgentAnnouncement.tsx";
import UpdateAnnouncementModal from "./UpdateAnnouncement.tsx";
import NormalAnnouncementModal from "./NormalAnnouncement.tsx";
const logo = require("../../Assets/logo.png");

const Navigation = ({ handleLogout }) => {
	const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isNormalModalOpen, setIsNormalModalOpen] = useState(false);

	// get-all-recent-user
	const handleSubmit = (type, message) => {
		console.log(`${type} Announcement Submitted:`, message);
	};

	const [requirementsDropdownOpen, setRequirementsDropdownOpen] =
		useState(false);
	const [announcementDropdownOpen, setAnnouncementDropdownOpen] =
		useState(false);

	const toggleRequirementsDropdown = () =>
		setRequirementsDropdownOpen(!requirementsDropdownOpen);
	const toggleAnnouncementDropdown = () =>
		setAnnouncementDropdownOpen(!announcementDropdownOpen);

	const [currentTime, setCurrentTime] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			const date = new Date();
			const formattedTime = new Intl.DateTimeFormat("en-US", {
				weekday: "short",
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				hour12: true,
			}).format(date);
			setCurrentTime(formattedTime);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<nav className="bg-dark-blue text-light-gray flex items-center justify-between p-4">
			<div className="flex items-center space-x-3">
				<img src={logo} alt="School Logo" className="h-10 w-auto" />
				<span className="text-xl font-semibold">
					CCC - Clearance System
				</span>
			</div>

			<div className="flex">
				<div className="flex items-center space-x-3">
					<span className="text-sm">{currentTime}</span>
				</div>
				<div className="border-l-2 border-gray-600 mx-4 h-6"></div>
				<ul className="flex space-x-6">
					<li>
						<a
							href="/"
							className="flex items-center hover:bg-blue-800 p-2 rounded transition"
						>
							<FontAwesomeIcon icon={faHome} className="mr-2" />
							Home
						</a>
					</li>

					<li className="relative">
						<button
							onClick={toggleRequirementsDropdown}
							className="flex items-center hover:bg-blue-800 p-2 rounded transition"
						>
							<FontAwesomeIcon icon={faTasks} className="mr-2" />
							Requirements
						</button>
						{requirementsDropdownOpen && (
							<ul className="absolute right-0 bg-dark-blue text-light-gray border border-gray-700 rounded shadow-md">
								<li>
									<a
										href="/handle-requirements"
										className="block px-4 py-2 hover:bg-blue-700"
									>
										Handle Requirements
									</a>
								</li>
								<li>
									<a
										href="/review-student-requirements"
										className="block px-4 py-2 hover:bg-blue-700"
									>
										Review Student Requirements
									</a>
								</li>
							</ul>
						)}
					</li>

					<li className="relative">
						<button
							onClick={toggleAnnouncementDropdown}
							className="flex items-center hover:bg-blue-800 p-2 rounded transition"
						>
							<FontAwesomeIcon
								icon={faBullhorn}
								className="mr-2"
							/>
							Post Announcement
						</button>
						{announcementDropdownOpen && (
							<ul className="absolute right-0 bg-dark-blue text-light-gray border border-gray-700 rounded shadow-md">
								<li>
									<button
										className="block px-4 py-2 hover:bg-blue-700"
										onClick={() =>
											setIsUrgentModalOpen(true)
										}
									>
										Urgent
									</button>
									{isUrgentModalOpen && (
										<UrgentAnnouncementModal
											onClose={() =>
												setIsUrgentModalOpen(false)
											}
										/>
									)}
								</li>
								<li>
									<button
										className="block px-4 py-2 hover:bg-blue-700"
										onClick={() =>
											setIsUpdateModalOpen(true)
										}
									>
										Update
									</button>
									{isUpdateModalOpen && (
										<UpdateAnnouncementModal
											onClose={() =>
												setIsUpdateModalOpen(false)
											}
										/>
									)}
								</li>
								<li>
									<button
										className="block px-4 py-2 hover:bg-blue-700"
										onClick={() =>
											setIsNormalModalOpen(true)
										}
									>
										Normal
									</button>
									{isNormalModalOpen && (
										<NormalAnnouncementModal
											onClose={() =>
												setIsNormalModalOpen(false)
											}
										/>
									)}
								</li>
							</ul>
						)}
					</li>

					<a
						onClick={handleLogout}
						className="flex items-center hover:bg-blue-800 p-2 rounded transition"
					>
						<FontAwesomeIcon icon={faSignOut} className="mr-2" />
						Logout
					</a>
				</ul>
			</div>
		</nav>
	);
};

export default Navigation;
