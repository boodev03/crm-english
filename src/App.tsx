import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";

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

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
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
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
