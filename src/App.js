import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import ZClasses from "./Pages/ZClasses";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import QueriesPage from "./Pages/QueriesPage";
import AddQueries from "./Pages/AddQueries";
import LeaveApp from "./Pages/LeaveApp";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Tasks from "./Pages/Tasks";
import Webcode from "./Pages/Webcode";
import Capstone from "./Pages/Capstone";
import Syllabus from "./Pages/Syllabus";

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: "#f9fbfd" },
      secondary: { main: "#4b0dba" },
      buttcolor: { main: "#2ed16c" },
      dark: { main: "#000" },
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
            <Route path="/queries" element={<QueriesPage />} />
            <Route path="/queries/add" element={<AddQueries />} />
            <Route path="/leaveapp" element={<LeaveApp />} />
            <Route path="/task" element={<Tasks />} />
            <Route path="/webcode" element={<Webcode />} />
            <Route path="/capstone" element={<Capstone />} />
            <Route path="/syllabus" element={<Syllabus />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
