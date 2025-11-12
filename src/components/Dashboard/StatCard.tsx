import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: StatCardProps) => {
  return (
    <Card className="shadow-card transition-smooth hover:shadow-elegant">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p
              className={cn(
                "text-xs mt-2 font-medium",
                trend === "up" ? "text-green-600" : "text-orange-600"
              )}
            >
              {change}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
