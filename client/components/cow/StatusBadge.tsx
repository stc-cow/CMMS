import * as React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "green" | "amber" | "red" | "ON-AIR" | "OFF-AIR" | "STANDBY";
  size?: "normal" | "small";
  label?: string;
}

export function StatusBadge({
  status,
  size = "normal",
  label,
}: StatusBadgeProps) {
  // Map status to color and icon
  const statusMap: Record<
    string,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle2 size={size === "small" ? 14 : 16} />,
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertCircle size={size === "small" ? 14 : 16} />,
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle size={size === "small" ? 14 : 16} />,
    },
    "ON-AIR": {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle2 size={size === "small" ? 14 : 16} />,
    },
    "OFF-AIR": {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle size={size === "small" ? 14 : 16} />,
    },
    STANDBY: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertCircle size={size === "small" ? 14 : 16} />,
    },
  };

  const config = statusMap[status] || statusMap.amber;

  if (size === "small") {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.text} ${config.border}`}
        title={label ? `${label}: ${status}` : status}
      >
        {config.icon}
        {label && <span>{label}</span>}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${config.bg} ${config.text} ${config.border}`}
    >
      {config.icon}
      {status}
    </div>
  );
}
