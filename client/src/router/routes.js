import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerHalls from "../pages/OwnerHalls";
import OwnerLayout from "../components/OwnerLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRoles={["hall-owner"]}>
        <OwnerLayout>
          <OwnerDashboard />
        </OwnerLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/owner/halls",
    element: (
      <ProtectedRoute allowedRoles={["hall-owner"]}>
        <OwnerLayout>
          <OwnerHalls />
        </OwnerLayout>
      </ProtectedRoute>
    ),
  },
]);
