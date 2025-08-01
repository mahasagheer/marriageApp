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
import AgencyDashboard from "../Pages/Phase_2/AgencyDashboard";
import { AgencyProfile } from "../Pages/Phase_2/AgencyProfileForm";
import { AgencyProfileDisplay } from "../Pages/Phase_2/AgencyProfile";
import AgencyListing from "../Pages/Phase_2/AgenciesListing";
import MatchmakingHome from "../Pages/Phase_2/Home";
import AgencyDetail from "../Pages/Phase_2/AgencyDetail";
import AgencyCandidateList from "../Pages/Phase_2/AgencyCandidateList";
import PublicProfileView from "../Pages/Phase_2/PublicProfileView";

export const router = createBrowserRouter([
  {
    path: "/public/user/:token",
    element: <PublicProfileView />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
        <MatchmakingHome />
        </UserLayout>
      </ProtectedRoute>
    ),
  },
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
    path: "/agency/users",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout >
          <AgencyCandidateList/>
          </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/user/addProfile",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <UserProfileForm />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/user/addProfile/:id",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <UserProfileForm />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/agency/addProfile",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout>
          <AgencyProfile />
        </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/agency",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout>
          <AgencyDashboard />
        </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/agency/addProfile/:id",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout>
          <AgencyProfile />
        </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/user/:id",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <UserProfileDisplay />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/userDetail/:id",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout>
          <UserProfileDisplay />
        </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/agency/profile",
    element: (
      <ProtectedRoute allowedRoles={['agency']}>
        <OwnerLayout>
          <AgencyProfileDisplay />
        </OwnerLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/user/agencies",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <AgencyListing />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/user/agencies/:id",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <AgencyDetail />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/match-making-form/:token",
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout>
          <AgencyDetail />
        </UserLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/:id",
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
    path: "/:id/halls",
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
        <OwnerLayout>
          <OwnerHalls />
        </OwnerLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/:id/halls/:id',
    element: (
      <ProtectedRoute allowedRoles={["hall-owner", "manager", "admin"]}>
        <HallDetail />
      </ProtectedRoute>)
    ,
  },
  {
    path: '/:id/my-bookings',
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
    path: '/:id/associate-manager',
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminAssignManagerPage />
      </ProtectedRoute>
    ),
  },
]);
