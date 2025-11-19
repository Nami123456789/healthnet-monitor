import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db.query("devices").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("devices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    ipAddress: v.string(),
    location: v.string(),
    protocol: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    return await ctx.db.insert("devices", {
      name: args.name,
      type: args.type,
      ipAddress: args.ipAddress,
      location: args.location,
      protocol: args.protocol,
      status: "online" as const,
      lastSeen: Date.now(),
      uptime: 100,
      cpuUsage: 0,
      memoryUsage: 0,
      networkTraffic: 0,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("devices"),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("warning")),
    uptime: v.number(),
    cpuUsage: v.number(),
    memoryUsage: v.number(),
    networkTraffic: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      lastSeen: Date.now(),
      uptime: args.uptime,
      cpuUsage: args.cpuUsage,
      memoryUsage: args.memoryUsage,
      networkTraffic: args.networkTraffic,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("devices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    
    await ctx.db.delete(args.id);
  },
});
