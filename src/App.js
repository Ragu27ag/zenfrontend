import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import ZClasses from "./Pages/ZClasses";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MarketPlace from "./Pages/MarketPlace";
import io from "socket.io-client";
import MyMarketPlace from "./Pages/MyMarketPlace";

// export const socket = io.connect(process.env.REACT_APP_URL);

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: "#f9fbfd" },
      secondary: { main: "#4b0dba" },
      buttcolor: { main: "#2ed16c" },
      dark: { main: "#000" },
      head: { main: "#555A8F" },
      mild: { main: "#7E8E9F" },
      patch: { main: "#FF9A28" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Main />}>
            <Route index element={<ZClasses />} />
            <Route path="/my-marketplace" element={<MyMarketPlace />} />
            <Route path="/marketplace" element={<MarketPlace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
