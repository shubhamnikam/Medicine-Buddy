import { createBrowserRouter } from "react-router";
import App from "../../App";
import Login from "../../components/features/login/Login";
import Register from "../../components/features/register/Register";
import Home from "../../components/features/steps/Home";
import Steps from "../../components/features/steps/Steps";
import Profile from "../../components/features/profile/Profile";
import History from "../../components/features/history/History";
import Logout from "../../components/features/logout/Logout";
import MainLayout from "../../components/shared/layout/MainLayout";
import CommonError from "../../components/shared/error/CommonError";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/main",
    Component: MainLayout,
    children: [
      {
        path: "/main/home",
        Component: Home,
      },
      {
        path: "/main/steps",
        Component: Steps,
      },
      {
        path: "/main/profile",
        Component: Profile,
      },
      {
        path: "/main/history",
        Component: History,
      },
    ],
  },
  {
    path: "/auth/login",
    Component: Login,
  },
  {
    path: "/auth/register",
    Component: Register,
  },
  {
    path: "/auth/logout",
    Component: Logout,
  },
  {
    path: "*/*",
    Component: CommonError,
  },
]);

export default router;
