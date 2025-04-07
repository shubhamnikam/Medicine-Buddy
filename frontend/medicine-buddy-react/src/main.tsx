import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./core/routers/app.router.ts";
import { Provider } from "react-redux";
import { store } from "./core/stores/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
