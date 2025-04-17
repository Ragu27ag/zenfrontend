import React, { useEffect, useMemo, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import FeedIcon from "@mui/icons-material/Feed";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import TaskIcon from "@mui/icons-material/Task";
import WebIcon from "@mui/icons-material/Web";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ArticleIcon from "@mui/icons-material/Article";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import SummarizeIcon from "@mui/icons-material/Summarize";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import logo from "../pics/latest_logo.jpeg";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const drawerWidth = 240;

const health = () => {
  backendInstance.get("/api/v1/health");
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Main = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const stuArr = ["Feed", "MarketPlace", "My Market"];

  const handleRedirect = (text) => {
    console.log(text);
    if (text === "My Market") {
      navigate("/my-marketplace");
    } else if (text === "Feed") {
      navigate("/");
    } else if (text === "MarketPlace") {
      navigate("/marketplace");
    } else if (text === "PortFolio-submission") {
      navigate("/portfolio");
    } else if (text === "Mock-interview") {
      navigate("/mockinterview");
    } else if (text === "Dashboard") {
      navigate("/dashboard");
    }
  };

  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  useEffect(() => {
    // if (Object.keys(User).length === 0) {
    //   navigate("/login");
    // } else {
    health();
    // }
  }, [User]);

  const [menus, setMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <>
        {" "}
        <AppBar position="fixed" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <img src={logo} alt="imagess" height={50} width={50} />

            {/* <Typography variant="h6" noWrap component="div">
              Herfemora
            </Typography> */}
            <div style={{ position: "relative" }}>
              <span>
                {User.name}&nbsp;
                <Avatar
                  sx={{
                    bgcolor: deepOrange[500],
                    display: "inline-flex",
                    margin: "6px",
                  }}
                  onClick={() => setMenu(!menus)}
                >
                  {User[0]?.user_name?.slice(0, 1)}
                </Avatar>
              </span>
              {menus && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "10px solid #e8e8e8 ",
                      top: "40px",
                      right: "8px",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor: "#e8e8e8",
                      right: "-10px",
                      top: "49px",
                      width: "100px",
                      height: "60px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        height: "100%",
                      }}
                      onClick={handleLogout}
                      onMouseOut={() => setMenu(false)}
                    >
                      logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </>

      <Drawer
        variant="permanent"
        open={open}
        onMouseOver={handleDrawerOpen}
        onMouseOut={handleDrawerClose}
      >
        <DrawerHeader>
          <p style={{ color: "#555A8F" }}>{User?.role?.toUpperCase()}</p>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {stuArr.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleRedirect(text)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {text === "Feed" ? (
                    <FeedIcon fontSize="small" />
                  ) : text === "Dashboard" ? (
                    <DashboardIcon fontSize="small" />
                  ) : text === "Tasks" ? (
                    <TaskIcon fontSize="small" />
                  ) : text === "Webcode" ? (
                    <WebIcon fontSize="small" />
                  ) : text === "Capstone" ? (
                    <AccountTreeIcon fontSize="small" />
                  ) : text === "Queries" ? (
                    <QueryStatsIcon fontSize="small" />
                  ) : text === "MarketPlace" ? (
                    <StorefrontIcon fontSize="small" />
                  ) : text === "Portfolio-submission" ? (
                    <ArticleIcon fontSize="small" />
                  ) : text === "Leave-applications" ? (
                    <MarkunreadMailboxIcon fontSize="small" />
                  ) : text === "Mock-interview" ? (
                    <VideoCallIcon fontSize="small" />
                  ) : text === "My Market" ? (
                    <AddBusinessIcon fontSize="small" />
                  ) : (
                    <SummarizeIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Main;
