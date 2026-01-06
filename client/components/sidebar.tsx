import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Truck,
  BarChart3,
  Users,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      href: "/",
      badge: null,
    },
    {
      icon: Package,
      label: "COW Registry",
      href: "/cows",
      badge: null,
    },
    {
      icon: Truck,
      label: "Movements",
      href: "/movements",
      badge: null,
    },
    {
      icon: Users,
      label: "Suppliers",
      href: "/suppliers",
      badge: null,
    },
    {
      icon: Zap,
      label: "Rate Cards",
      href: "/rate-cards",
      badge: null,
    },
    {
      icon: FileText,
      label: "Invoices",
      href: "/invoices",
      badge: null,
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      badge: null,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center group">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2F2884fc9a1a5d47faad23fb841f7538d3?format=webp&width=150"
              alt="ACES Managed Services"
              className="h-16 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-6 border-t border-sidebar-border space-y-4">
          <div className="bg-sidebar-accent/10 rounded-lg p-4">
            <p className="text-xs text-sidebar-foreground/70">
              💡 Tip: Use keyboard shortcut{" "}
              <kbd className="bg-sidebar-background px-2 py-1 rounded text-xs font-mono">
                Cmd+K
              </kbd>{" "}
              to search
            </p>
          </div>
          <div className="text-xs text-sidebar-foreground/50">
            <p>© 2024 CowTrack</p>
            <p>Operations Management System</p>
          </div>
        </div>
      </aside>
    </>
  );
}
