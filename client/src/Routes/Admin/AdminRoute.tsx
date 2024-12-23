import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./Navigation.tsx";
import HomePage from "./Home.tsx";
import HandlingRequirementsPage from "./HandleRequirement.tsx";
import HandleUserRequirements from "./HandleUserRequirement.tsx";
import { ToastContainer } from "react-toastify";

const LoginPage = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (username === "admin@ccc.edu.ph" && password === "admin") {
			onLogin(true);
		} else {
			alert("Invalid credentials");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded shadow-lg w-80"
			>
				<h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
				<div className="mb-4">
					<label htmlFor="username" className="block text-lg">
						Username
					</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="mb-6">
					<label htmlFor="password" className="block text-lg">
						Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default function AdminRoute({ className }) {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem("isAuthenticated") === "true" || false
	);

	const handleLogin = (status) => {
		setIsAuthenticated(status);
		localStorage.setItem("isAuthenticated", status);
	};

	// Handle logout action
	const handleLogout = () => {
		setIsAuthenticated(false);
		localStorage.setItem("isAuthenticated", "false");
	};

	if (!isAuthenticated) {
		return <LoginPage onLogin={handleLogin} />;
	}

	return (
		<div className="admin">
			<Navigation handleLogout={handleLogout} />
			<Routes>
				<Route index path="/" element={<HomePage />} />
				<Route
					path="/handle-requirements"
					element={<HandlingRequirementsPage />}
				/>
				<Route
					path="/review-student-requirements"
					element={<HandleUserRequirements />}
				/>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<ToastContainer />
		</div>
	);
}
