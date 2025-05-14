import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/nprogress/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import ProtectedRoutes from "./components/layouts/ProtectedRoutes";
import PublicRoutes from "./components/layouts/PublicRoutes";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { useInitializeAuth } from "./stores/useAuthStore";

import dayjs from "dayjs";
import Courses from "./pages/courses/Courses";
import Rooms from "./pages/room/Room";
import Students from "./pages/students/Students";
import Teachers from "./pages/teachers/Teachers";
import Test from "./pages/test/Test";

import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import CourseDetail from "./pages/courses/CourseDetail";

const myColor: MantineColorsTuple = [
  "#fff1e2",
  "#ffe1cc",
  "#ffc29a",
  "#ffa164",
  "#fe8537",
  "#fe731a",
  "#ff6400",
  "#e45800",
  "#cb4d00",
  "#b14000",
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
  fontFamily: "Poppins, sans-serif",
});

// Create a client
const queryClient = new QueryClient();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

function AppContent() {
  // Initialize auth state
  useInitializeAuth();

  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route
        path="/auth"
        element={
          <PublicRoutes>
            <Outlet />
          </PublicRoutes>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <div>Dashboard</div>
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Teachers />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Students />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/practice/listening"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <div>Listening Practice</div>
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Rooms />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <CourseDetail />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <NavigationProgress />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
