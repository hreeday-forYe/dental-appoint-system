import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Login,
  Register,
  Activate,
  DentistRegistrationForm,
  DentistAppointments,
  AdminDashboard,
  AdminAllUsers,
  AdminAllDentists,
  AdminAddDentist,
} from "./components";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ProfilePage,
  RegistrationSuccessPage,
  BookAppointmentPage,
  AppointmentPage,
  FindDoctorsPage,
  DentistDashboardPage,
  AdminDashboardPage,
  SingleDentistPage,
} from "./pages";
import AuthLayout from "./routes/AuthLayout";
import AdminLayout from "./routes/AdminLayout";
import DentistLayout from "./routes/DentistLayout";
import AdminAllAppointments from "./components/Dashboard/AdminAllAppointments";

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
        path: "/my-appointments",
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
      {
        path: "/dentist/:id",
        element: (
          <AuthLayout authentication={true}>
            <SingleDentistPage />,
          </AuthLayout>
        ),
      },
      {
        path: "/register-as-dentist",
        element: (
          <AuthLayout authentication={true}>
            <DentistRegistrationForm />
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboardPage />,
    children: [
      {
        index: "admin",
        element: (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        ),
      }, // Default admin dashboard
      {
        path: "all-users",
        element: (
          <AdminLayout>
            <AdminAllUsers />
          </AdminLayout>
        ),
      }, //  admin All Users Management
      {
        path: "all-appointments",
        element: (
          <AdminLayout>
            <AdminAllAppointments />
          </AdminLayout>
        ),
      }, // Default admin dashboard
      {
        path: "all-dentists",
        element: (
          <AdminLayout>
            <AdminAllDentists />
          </AdminLayout>
        ),
      }, // Default admin dashboard
      {
        path: "add-dentist",
        element: (
          <AdminLayout>
            <AdminAddDentist />
          </AdminLayout>
        ),
      }, // Default admin dashboard
    ],
  },
  {
    path: "/dentist",
    element: <DentistDashboardPage />,
    children: [
      {
        index: true,
        element: (
          <DentistLayout>
            <AdminDashboard />
          </DentistLayout>
        ),
      }, // Default Dentist Dashboard page
      {
        path: "appointments",
        element: (
          <DentistLayout>
            <DentistAppointments />
          </DentistLayout>
        ),
      }, // Default Dentist Dashboard page
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
