import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login, Register, Activate } from "./components";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ProfilePage,
  RegistrationSuccessPage,
  BookAppointmentPage,
  AppointmentPage,
  FindDoctorsPage
} from "./pages";
import AuthLayout from "./routes/AuthLayout";


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
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <ProfilePage />
          </AuthLayout>
        ),
      },
      {
        path: "/book-appointment",
        element: (
          <AuthLayout authentication={true}>
            <BookAppointmentPage />
          </AuthLayout>
        ),
      },

      {
        path: "/all-appointments",
        element: (
          <AuthLayout authentication={true}>
            <AppointmentPage />
          </AuthLayout>
        ),
      },
      {
        path: "/all-doctors",
        element: <FindDoctorsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
