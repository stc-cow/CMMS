import { StatusSummary } from "@shared/api";
import { Activity, AlertCircle, Pause } from "lucide-react";

interface Props {
  data: StatusSummary;
  onDrillDown?: (siteStatus: string) => void;
}

export function StatusSummaryCards({ data, onDrillDown }: Props) {
  const statusCards = [
    {
      label: "ON-AIR COWs",
      value: data.onAir,
      color: "bg-green-500/10 border-green-500/20",
      icon: Activity,
      iconColor: "text-green-600",
      status: "ON-AIR",
    },
    {
      label: "Warehouse / Not Deployed",
      value: data.offAir,
      color: "bg-red-500/10 border-red-500/20",
      icon: AlertCircle,
      iconColor: "text-red-600",
      status: "OFF-AIR",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statusCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.status}
            onClick={() => onDrillDown?.(card.status)}
            className={`${card.color} border rounded-lg p-6 space-y-2 transition-all hover:shadow-md cursor-pointer text-left`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                {card.label}
              </h3>
              <Icon size={20} className={card.iconColor} />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">Click to drill down</p>
          </button>
        );
      })}
    </div>
  );
}
