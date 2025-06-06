import { Card, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle, AlertCircle, Activity } from "lucide-react";
import { ChargingStation } from "@/hooks/use-stations";

interface StationStatsProps {
  stations: ChargingStation[];
}

export function StationStats({ stations }: StationStatsProps) {
  const totalStations = stations.length;
  const activeStations = stations.filter(s => s.status === 'active').length;
  const maintenanceStations = stations.filter(s => s.status === 'maintenance').length;
  const totalPower = stations.reduce((sum, station) => sum + station.powerOutput, 0);

  const stats = [
    {
      title: "Total Stations",
      value: totalStations,
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Stations",
      value: activeStations,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Maintenance",
      value: maintenanceStations,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Power",
      value: `${totalPower} kW`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}