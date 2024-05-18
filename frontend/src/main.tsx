import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.tsx";
import MainPage from "./pages/index.tsx";
import Verify from "./pages/verify.tsx";

import initNoirC from '@noir-lang/noirc_abi';
import initACVM from '@noir-lang/acvm_js';

const InitWasm = ({ children }) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        initACVM(new URL('@noir-lang/acvm_js/web/acvm_js_bg.wasm', import.meta.url).toString()),
        initNoirC(
          new URL('@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', import.meta.url).toString(),
        ),
      ]);
      setInit(true);
    })();
  });

    return <div>{init && children}</div>;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Layout>
         <InitWasm>
				<MainPage />
        </InitWasm>
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

// biome-ignore lint/style/noNonNullAssertion:
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
            <RouterProvider router={router} />
	</React.StrictMode>,
);
