import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { MapView } from "@/components/map/mapview";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChargingStation } from "@/types";

export default function Map() {
  const { stations, isLoading } = useStations();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  const handleStationSelect = (station: ChargingStation) => {
    setSelectedStation(station);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Loading..." />
        <div className="flex-1 overflow-y-auto p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar 
        title="Map View" 
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <MapView
          stations={stations}
          selectedStation={selectedStation}
          onStationSelect={handleStationSelect}
        />
      </div>
    </div>
  );
}