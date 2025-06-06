import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chargingStations = pgTable("charging_stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  status: text("status").notNull(), // 'active', 'inactive', 'maintenance'
  powerOutput: integer("power_output").notNull(), // in kW
  connectorType: text("connector_type").notNull(), // 'type1', 'type2', 'ccs', 'chademo'
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertChargingStationSchema = createInsertSchema(chargingStations).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  powerOutput: z.number().min(1).max(1000),
  status: z.enum(['active', 'inactive', 'maintenance']),
  connectorType: z.enum(['type1', 'type2', 'ccs', 'chademo']),
});

export const updateChargingStationSchema = insertChargingStationSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChargingStation = z.infer<typeof insertChargingStationSchema>;
export type UpdateChargingStation = z.infer<typeof updateChargingStationSchema>;
export type ChargingStation = typeof chargingStations.$inferSelect;