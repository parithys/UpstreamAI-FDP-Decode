import * as React from "react";
import { Card } from "./card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "./utils";

export interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  description,
  className = "",
}: StatCardProps) {
  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      case "neutral":
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    // For business metrics: up is usually good (green), down is bad (red)
    switch (direction) {
      case "up":
        return "text-success";
      case "down":
        return "text-danger";
      case "neutral":
        return "text-text-secondary";
    }
  };

  return (
    <Card className={cn("flex flex-col h-full", className)} variant="default">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-text-secondary">{label}</h3>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        {trend ? (
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={cn(
                "text-2xl font-bold flex items-center gap-1",
                getTrendColor(trend.direction)
              )}
            >
              {getTrendIcon(trend.direction)}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-sm text-text-secondary">{trend.label}</span>
            )}
          </div>
        ) : (
          <span className="text-3xl font-bold text-text-primary">{value}</span>
        )}
      </div>

      {description && (
        <p className="text-sm text-text-secondary mt-auto leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
}
