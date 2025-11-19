import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    devices: defineTable({
      name: v.string(),
      type: v.string(),
      ipAddress: v.string(),
      location: v.string(),
      protocol: v.string(),
      status: v.union(v.literal("online"), v.literal("offline"), v.literal("warning")),
      lastSeen: v.number(),
      uptime: v.number(),
      cpuUsage: v.number(),
      memoryUsage: v.number(),
      networkTraffic: v.number(),
    }),

    alerts: defineTable({
      deviceId: v.id("devices"),
      deviceName: v.string(),
      severity: v.union(v.literal("critical"), v.literal("warning"), v.literal("info")),
      message: v.string(),
      type: v.string(),
      status: v.union(v.literal("active"), v.literal("acknowledged"), v.literal("resolved")),
      acknowledgedBy: v.union(v.string(), v.null()),
      resolvedAt: v.union(v.number(), v.null()),
    }),

    metrics: defineTable({
      deviceId: v.id("devices"),
      cpuUsage: v.number(),
      memoryUsage: v.number(),
      networkTraffic: v.number(),
      uptime: v.number(),
      timestamp: v.number(),
    }).index("by_device", ["deviceId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;