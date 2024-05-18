import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.tsx";
import MainPage from "./pages/index.tsx";
import Verify from "./pages/verify.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Layout>
				<MainPage />
			</Layout>
		),
	},
	{
		path: "verify",
		element: (
			<Layout>
				<Verify />
			</Layout>
		),
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
