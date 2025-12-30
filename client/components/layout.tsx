import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Bell, User, Settings } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
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

            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <User size={20} className="text-primary-foreground" />
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
