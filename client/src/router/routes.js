import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerHalls from "../pages/OwnerHalls";
import OwnerLayout from "../components/OwnerLayout";
import HallDetail from '../pages/HallDetail';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';

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
  {
    path: '/halls/:id',
    element: <HallDetail />,
  },
  {
    path: '/my-bookings',
    element: <MyBookings />,
  },
  {
    path: '/owner/bookings',
    element: <MyBookings />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/owner/profile',
    element: <Profile />,
  },
]);
