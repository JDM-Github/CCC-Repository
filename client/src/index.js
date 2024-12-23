import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./Routes/Admin/AdminRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<AdminRoute />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
