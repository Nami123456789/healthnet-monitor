import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const record = mutation({
  args: {
    deviceId: v.id("devices"),
    cpuUsage: v.number(),
    memoryUsage: v.number(),
    networkTraffic: v.number(),
    uptime: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("metrics", {
      deviceId: args.deviceId,
      cpuUsage: args.cpuUsage,
      memoryUsage: args.memoryUsage,
      networkTraffic: args.networkTraffic,
      uptime: args.uptime,
      timestamp: Date.now(),
    });
  },
});

export const getByDevice = query({
  args: { 
    deviceId: v.id("devices"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    const metrics = await ctx.db
      .query("metrics")
      .filter(q => q.eq(q.field("deviceId"), args.deviceId))
      .order("desc")
      .take(args.limit || 50);
    
    return metrics;
  },
});
