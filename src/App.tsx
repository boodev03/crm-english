import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
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
import { PRIVATE_ROUTES } from "./routes/route";
import { useInitializeAuth } from "./stores/useAuthStore";

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

function AppContent() {
  // Initialize auth state
  useInitializeAuth();

  return (
    <Routes>
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
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoutes>
        }
      >
        <Route
          index
          element={<Navigate to={PRIVATE_ROUTES.dashboard} replace />}
        />
        <Route path="dashboard" element={<div>Dashboard</div>} />
        <Route path="teachers" element={<div>Teachers</div>} />
        <Route path="students" element={<div>Students</div>} />
        <Route
          path="practice/listening"
          element={<div>Listening Practice</div>}
        />
      </Route>
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
