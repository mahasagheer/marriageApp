import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import OwnerLayout from "../components/OwnerLayout";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerHalls from "../pages/OwnerHalls";
import HallDetail from "../pages/HallDetail";
import { MyBookings } from "../pages/MyBooking";
import UserLayout from "../components/UserLayout";
import UserProfileForm from "../pages/UserProfileForm";
import SearchResults from "../pages/SearchResults";
import PublicHallDetail from "../pages/PublicHallDetail";

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
    path: "/user",
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
  {
    path: '/search-results',
    element: <SearchResults />,
  },
  {
    path: '/public-halls/:id',
    element: <PublicHallDetail />,
  },
]);
