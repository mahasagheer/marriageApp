import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import ProtectedRoute from "../Components/ProtectedRoute";
import OwnerLayout from "../Components/OwnerLayout";
import OwnerDashboard from "../Pages/OwnerDashboard";
import OwnerHalls from "../Pages/OwnerHalls";
import HallDetail from "../Pages/HallDetail";
import { MyBookings } from "../Pages/MyBooking";
import UserLayout from "../Components/Phase_2/UserLayout";
import UserProfileForm from "../Pages/Phase_2/UserProfileForm";
import RishtaDhondoHome from "../Pages/Phase_2/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/rishta",
    element:<RishtaDhondoHome/>
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
    path: "/rishta",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <UserLayout>
          <UserProfileForm />
        </UserLayout>
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
    path: '/owner/my-bookings',
    element: <MyBookings />,
  },

]);
