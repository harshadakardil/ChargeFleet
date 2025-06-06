import { users, chargingStations } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import type { User, ChargingStation, InsertUser } from "@/types";
import { CreateStationData } from "@/hooks/use-stations";

export type UpdateStationData = Partial<CreateStationData> & { id: number };

export class DatabaseStorage {
  // User methods (unchanged)
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (!result[0]) return undefined;
    const { id: userId, email, username, createdAt } = result[0];
    return { id: userId, email, username, createdAt } as User;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    if (!result[0]) return undefined;
    const { id, email: userEmail, username, createdAt } = result[0];
    return { id, email: userEmail, username, createdAt } as User;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    if (!result[0]) return undefined;
    const { id, email, username: userUsername, createdAt } = result[0];
    return { id, email, username: userUsername, createdAt } as User;
  }
  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db
      .insert(users)
      .values({
        ...user,
        createdAt: new Date(),
      })
      .returning();
    // Assuming result matches User type
    return {
      id: result.id,
      email: result.email,
      username: result.username,
      createdAt: result.createdAt,
    } as User;
  }

  // Charging station methods
  async getChargingStations(userId: number): Promise<ChargingStation[]> {
    const results = await db
      .select()
      .from(chargingStations)
      .where(eq(chargingStations.userId, userId));
    return results.map((station) => ({
      ...station,
      status: station.status as "active" | "inactive" | "maintenance",
      connectorType: station.connectorType as "type1" | "type2" | "ccs" | "chademo",
      createdAt: station.createdAt instanceof Date ? station.createdAt.toISOString() : station.createdAt,
      updatedAt: station.updatedAt instanceof Date ? station.updatedAt.toISOString() : station.updatedAt,
    }));
  }

  async createChargingStation(station: CreateStationData): Promise<ChargingStation> {
    const [result] = await db
      .insert(chargingStations)
      .values({
        ...station,
        latitude: station.latitude.toString(),
        longitude: station.longitude.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      ...result,
      status: result.status as "active" | "inactive" | "maintenance",
      connectorType: result.connectorType as "type1" | "type2" | "ccs" | "chademo",
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : result.createdAt,
      updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : result.updatedAt,
    } as ChargingStation;
  }

  async updateChargingStation(
    id: number,
    userId: number,
    updates: UpdateStationData // see next section for this type
  ): Promise<ChargingStation | undefined> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.latitude !== undefined) {
      updateData.latitude = updates.latitude.toString();
    }
    if (updates.longitude !== undefined) {
      updateData.longitude = updates.longitude.toString();
    }

    const [result] = await db
      .update(chargingStations)
      .set(updateData)
      .where(
        and(
          eq(chargingStations.id, id),
          eq(chargingStations.userId, userId)
        )
      )
      .returning();
    if (!result) return undefined;
    return {
      ...result,
      status: result.status as "active" | "inactive" | "maintenance",
      connectorType: result.connectorType as "type1" | "type2" | "ccs" | "chademo",
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : result.createdAt,
      updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : result.updatedAt,
    } as ChargingStation;
  }

  async updateStation(data: CreateStationData) {
    // implementation
  }

  async deleteChargingStation(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(chargingStations)
      .where(
        and(
          eq(chargingStations.id, id),
          eq(chargingStations.userId, userId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();

export interface StationFiltersProps {
  searchValue: string;
  statusValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}