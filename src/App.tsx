import "./App.css";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from "@mantine/core";
import { DashboardLayout } from "./components/DashboardLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Teachers from "./pages/teachers/Teachers";
import Students from "./pages/Students";

const myColor: MantineColorsTuple = [
  "#e1f8ff",
  "#cbedff",
  "#9ad7ff",
  "#64c1ff",
  "#3aaefe",
  "#20a2fe",
  "#099cff",
  "#0088e4",
  "#0079cd",
  "#0068b6",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
