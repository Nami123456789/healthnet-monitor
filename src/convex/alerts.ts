import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    let alertsQuery = ctx.db.query("alerts").order("desc");
    
    const alerts = await alertsQuery.collect();
    
    if (args.status && args.status !== "all") {
      return alerts.filter(alert => alert.status === args.status);
    }
    
    return alerts;
  },
});

export const create = mutation({
  args: {
    deviceId: v.id("devices"),
    deviceName: v.string(),
    severity: v.union(v.literal("critical"), v.literal("warning"), v.literal("info")),
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      deviceId: args.deviceId,
      deviceName: args.deviceName,
      severity: args.severity,
      message: args.message,
      type: args.type,
      status: "active" as const,
      acknowledgedBy: null,
      resolvedAt: null,
    });
  },
});

export const acknowledge = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    await ctx.db.patch(args.id, {
      status: "acknowledged" as const,
      acknowledgedBy: user.name || user.email || "User",
    });
  },
});

export const resolve = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    await ctx.db.patch(args.id, {
      status: "resolved" as const,
      resolvedAt: Date.now(),
    });
  },
});
