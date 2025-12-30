import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear any stored session data (if needed)
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 h-20 bg-card border-b border-border flex items-center justify-between px-6 md:px-8 shadow-sm">
          <div className="md:block hidden">
            <h1 className="text-xl font-bold text-foreground">
              COW Movement Management System
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Bell size={20} />
            </button>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <User size={20} className="text-primary-foreground" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 animate-in fade-in duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@aces.com</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-3"
                  >
                    <Settings size={16} className="text-muted-foreground" />
                    Account Settings
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3 border-t border-border mt-2 pt-2"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
