import React from "react";
import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import Todo from "./components/Todo";
function Layout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default Layout;
