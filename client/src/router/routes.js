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
import SearchResults from "../Pages/SearchResults";
import PublicHallDetail from "../Pages/PublicHallDetail";
import CustomDealBooking from '../Pages/CustomDealBooking';
import AdminAssignManagerPage from '../Pages/AdminAssignManagerPage';
import UserProfileDisplay from "../Pages/Phase_2/ProfilePageUser";

export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <CoverPage />,
  // },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/match",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <RishtaDhondoHome />
      </ProtectedRoute>
    )
  },
{
  path: "/user/addProfile/:id",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <OwnerLayout>
        <UserProfileForm />
        </OwnerLayout>
      </ProtectedRoute>
    )
},
{
  path: "/user/profile",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <OwnerLayout>
        <UserProfileDisplay />
        </OwnerLayout>
      </ProtectedRoute>
    )
},
  {
    path: "/:role",
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
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
    path: "/:role/halls",
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
        <OwnerLayout>
          <OwnerHalls />
        </OwnerLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/:role/halls/:id',
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
        <HallDetail />
      </ProtectedRoute>)
    ,
  },
  {
    path: '/:role/my-bookings',
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
        <MyBookings />
      </ProtectedRoute>),
  },
  {
    path: '/search-results',
    element: <SearchResults />,
  },
  {
    path: '/public-halls/:id',
    element: <PublicHallDetail />,
  },
  {
    path: '/custom-booking/:token',
    element: <CustomDealBooking />,
  },
  {
    path: '/admin/associate-manager',
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminAssignManagerPage />
      </ProtectedRoute>
    ),
  },
]);
