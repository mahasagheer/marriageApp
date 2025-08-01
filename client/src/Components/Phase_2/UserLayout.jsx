// Sidebar.jsx
import { Footer } from "../Layout/Footer";
import { NavBar } from "../Layout/navbar";

const UserLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
      <main
        className="mx-auto"
      >
        {children}
      </main>
      <Footer/>
  </div>
);

export default UserLayout; 