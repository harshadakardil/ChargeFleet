
// src/types.ts (or src/lib/types.ts, src/@types/index.ts)
export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChargingStation {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: "active" | "inactive" | "maintenance";
  powerOutput: number;
  connectorType: "type1" | "type2" | "ccs" | "chademo";
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// For form inputs (numbers for lat/lng)
export interface CreateStationInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive" | "maintenance";
  powerOutput: number;
  connectorType: "type1" | "type2" | "ccs" | "chademo";
  userId: number;
}

// For updates (all fields optional except id)
export interface UpdateStationInput {
  id: number;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: "active" | "inactive" | "maintenance";
  powerOutput?: number;
  connectorType?: "type1" | "type2" | "ccs" | "chademo";
}

// Database insertion type
export interface InsertChargingStation extends Omit<ChargingStation, "id" | "createdAt" | "updatedAt"> {}

// Database update type
export interface UpdateChargingStation extends Partial<Omit<ChargingStation, "id" | "userId" | "createdAt" | "updatedAt">> {}

// User insertion type
export interface InsertUser {
  email: string;
  username: string;
  password: string;
}

export type UpdateStationData = Partial<CreateStationInput> & { id: number };