import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";

/*
 * AppLayout
 * ----------
 * Main layout used by all authenticated FinSight pages.
 *
 * Structure:
 * Sidebar + Topbar + Page Content
 *
 * Outlet renders the currently active page.
 */
function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Opens the mobile navigation
  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
  };

  // Closes the mobile navigation
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Main application area */}
      <div className="min-h-screen lg:ml-72">
        {/* Top navigation */}
        <Topbar onMenuClick={openMobileSidebar} />

        {/* Page content */}
        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
