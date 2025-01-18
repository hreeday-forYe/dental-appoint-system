import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login, Register, Activate } from "./components";
import { HomePage } from "./pages";
import AuthLayout from "./routes/AuthLayout";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import NewAppoinment from "./pages/NewAppoinment";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/activate",
        element: (
          <AuthLayout authentication={false}>
            <Activate />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/register-success",
        element: (
          <AuthLayout authentication={false}>
            <RegistrationSuccessPage />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={false}>
            <ProfilePage />
          </AuthLayout>
        ),
      },
      {
        path: "/new-appointment",
        element: (
          <AuthLayout authentication={false}>
            <NewAppoinment />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </StrictMode>
);
