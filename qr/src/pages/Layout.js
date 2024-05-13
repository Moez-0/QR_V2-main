import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const Layout = () => {
  return (

    <>
    <Loader />
    <Navbar />

      <Outlet />
    </>
  )
};

export default Layout;