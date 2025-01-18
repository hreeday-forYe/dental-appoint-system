import { ToastContainer, Bounce } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "./components";
function App() {
  const location = useLocation();
  const isAuthPath =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/register-success" ||
    location.pathname === "/activate";
  return (
    <>
      {!isAuthPath && <Header />}
      <div className="min-h-screen flex flex-wrap content-between">
        <div className="w-full block">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      {!isAuthPath && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default App;
