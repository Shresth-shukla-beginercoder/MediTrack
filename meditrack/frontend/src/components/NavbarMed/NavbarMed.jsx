import { useState } from "react";
import Brand from "./Brand";
import DesktopNavigation from "./DesktopNavigation";
import AccountActions from "./AccountActions";
import MobileNavigation from "./MobileNavigation";

export function NavbarMed() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            <Brand />
            <DesktopNavigation />
            <AccountActions />

            <button
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

export default NavbarMed;
