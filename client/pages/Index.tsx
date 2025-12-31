import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Users,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Active COWs",
      value: "12",
      change: "+2 this week",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending Movements",
      value: "5",
      change: "1 urgent",
      icon: Truck,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "This Month Revenue",
      value: "SAR 450K",
      change: "+12% vs last month",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Invoices Generated",
      value: "23",
      change: "8 pending approval",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      label: "Create Movement",
      description: "Start a new COW movement",
      href: "/movements",
      icon: Truck,
      badge: "Common",
    },
    {
      label: "Add Equipment Line",
      description: "Add equipment to movement",
      href: "/movements",
      icon: Package,
      badge: "Quick",
    },
    {
      label: "Generate Invoice",
      description: "Create monthly invoice",
      href: "/invoices",
      icon: FileText,
      badge: "Finance",
    },
    {
      label: "View Suppliers",
      description: "Manage supplier details",
      href: "/suppliers",
      icon: Users,
      badge: "Admin",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "movement_completed",
      title: "Movement CWN-087 completed",
      description: "Crane 50 delivered to Madinah site",
      timestamp: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "invoice_pending",
      title: "Invoice INV-2024-001 pending approval",
      description: "Awaiting finance department review",
      timestamp: "4 hours ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      id: 3,
      type: "supplier_update",
      title: "Rate card updated for Prime Mover",
      description: "New pricing effective from Jan 2024",
      timestamp: "1 day ago",
      icon: Zap,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "movement_created",
      title: "New movement CWN-981 created",
      description: "Multiple equipment planned",
      timestamp: "2 days ago",
      icon: Truck,
      color: "text-purple-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to ACES Operations
            </h1>
            <p className="text-muted-foreground mb-4">
              Manage your COW movements and equipment operations efficiently.
              Today you have 5 pending movements and 8 invoices awaiting
              approval.
            </p>
            <div className="flex gap-3">
              <Link
                to="/movements"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                <Truck size={18} />
                Create Movement
              </Link>
              <Link
                to="/invoices"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                <FileText size={18} />
                Review Invoices
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {stat.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap size={24} className="text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    to={action.href}
                    className="block p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {action.badge}
                      </span>
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock size={24} className="text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => {
                const ActivityIcon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${activity.color} mt-1`}>
                        <ActivityIcon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {activity.timestamp}
                        </p>
                      </div>
                      <ArrowRight className="flex-shrink-0 text-muted-foreground/30 group-hover:translate-x-1 transition-transform size-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Module Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/cows"
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">COW Registry</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage COW assets, locations, and status tracking
              </p>
              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Manage COWs <ArrowRight size={16} />
              </span>
            </Link>

            <Link
              to="/movements"
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Movements</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create, track, and complete COW movements
              </p>
              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                View Movements <ArrowRight size={16} />
              </span>
            </Link>

            <Link
              to="/suppliers"
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Suppliers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage supplier details and rate cards
              </p>
              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                View Suppliers <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
