import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";
import { motion } from "motion/react";

/*
 * AppLayout
 * ---------
 * Main layout used by all authenticated FinSight pages.
 *
 * Structure: Sidebar + Topbar + Page Content with a premium page mount
 * animation.
 */
function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen relative bg-[var(--canvas)] text-[var(--text-primary)]">
      {/* Ambient background glow (theme-aware via CSS variables) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--accent-glass)] blur-[120px] mixed-blend-mode-plus-lighter" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--secondary-soft)] blur-[120px] mixed-blend-mode-plus-lighter" />
      </div>

      <Sidebar />

      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      <div className="min-h-screen lg:ml-72">
        <Topbar onMenuClick={openMobileSidebar} />

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="px-4 pb-10 pt-8 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-[1560px]">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default AppLayout;
