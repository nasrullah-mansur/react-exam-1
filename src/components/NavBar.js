import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

function NavBar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = [
        {
            text: "Our Task",
            to: "/",
        },
        {
            text: "Create",
            to: "/create",
        },
    ];

    // Navbar;
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    return (
        <AppBar component="nav">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}>
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        display: { xs: "none", sm: "block" },
                    }}>
                    MUI
                </Typography>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    {navItems.map((item, index) => (
                        <Button key={index} sx={{ color: "#fff" }}>
                            <NavLink
                                style={{
                                    color: "#fff",
                                    textDecoration: "none",
                                }}
                                to={item.to}>
                                {" "}
                                {item.text}{" "}
                            </NavLink>
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
