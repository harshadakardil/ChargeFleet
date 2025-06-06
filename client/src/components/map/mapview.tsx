import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap } from 'lucide-react';
import { ChargingStation } from '@/hooks/use-stations';

interface MapViewProps {
  stations: ChargingStation[];
  selectedStation?: ChargingStation | null;
  onStationSelect?: (station: ChargingStation) => void;
}

export function MapView({ stations, selectedStation, onStationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'inactive':
        return 'bg-red-500 hover:bg-red-600';
      case 'maintenance':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatConnectorType = (type: string) => {
    switch (type) {
      case 'ccs':
        return 'CCS';
      case 'chademo':
        return 'CHAdeMO';
      case 'type1':
        return 'Type 1';
      case 'type2':
        return 'Type 2';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Station Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Map placeholder */}
            <div 
              ref={mapRef}
              className="h-96 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5f3ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Map overlay with city grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 h-full">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border-r border-gray-300 last:border-r-0" />
                  ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b border-gray-300 last:border-b-0" />
                  ))}
                </div>
              </div>

              {/* Station markers */}
              {stations.map((station) => {
                const lat = Number(station.latitude);
                const lng = Number(station.longitude);
                
                if (isNaN(lat) || isNaN(lng)) return null;

                const x = ((lng + 180) / 360) * 100;
                const y = ((90 - lat) / 180) * 100;
                const clampedX = Math.max(5, Math.min(95, x));
                const clampedY = Math.max(5, Math.min(95, y));

                return (
                  <button
                    key={station.id}
                    className={`absolute w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white transition-all transform hover:scale-110 ${getStatusColor(station.status)}`}
                    style={{
                      left: `${clampedX}%`,
                      top: `${clampedY}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => onStationSelect?.(station)}
                    title={station.name}
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station details panel */}
      {selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedStation.name}</span>
              <Badge className={getStatusColor(selectedStation.status).replace('bg-', 'bg-').replace('hover:bg-', 'text-white ')}>
                {selectedStation.status.charAt(0).toUpperCase() + selectedStation.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{selectedStation.address}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Power Output:</span>
                  <p className="text-sm text-gray-900">{selectedStation.powerOutput} kW</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Connector Type:</span>
                  <p className="text-sm text-gray-900">{formatConnectorType(selectedStation.connectorType)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Latitude:</span>
                  <p className="text-sm text-gray-900">{selectedStation.latitude}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Longitude:</span>
                  <p className="text-sm text-gray-900">{selectedStation.longitude}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}