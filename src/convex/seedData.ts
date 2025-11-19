import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const devices = [
      {
        name: "MRI Scanner A",
        type: "Medical Imaging",
        ipAddress: "192.168.1.100",
        location: "Building A, Floor 3",
        protocol: "SNMP",
        status: "online" as const,
        lastSeen: Date.now(),
        uptime: 99.8,
        cpuUsage: 45.2,
        memoryUsage: 62.5,
        networkTraffic: 125.3,
      },
      {
        name: "Patient Monitor B",
        type: "Vital Signs",
        ipAddress: "192.168.1.101",
        location: "ICU Ward",
        protocol: "NETCONF",
        status: "online" as const,
        lastSeen: Date.now(),
        uptime: 100,
        cpuUsage: 23.1,
        memoryUsage: 41.2,
        networkTraffic: 89.7,
      },
      {
        name: "Infusion Pump C",
        type: "Drug Delivery",
        ipAddress: "192.168.1.102",
        location: "Building B, Floor 2",
        protocol: "SNMP",
        status: "warning" as const,
        lastSeen: Date.now(),
        uptime: 95.3,
        cpuUsage: 78.9,
        memoryUsage: 85.4,
        networkTraffic: 156.2,
      },
      {
        name: "X-Ray Machine D",
        type: "Medical Imaging",
        ipAddress: "192.168.1.103",
        location: "Radiology Department",
        protocol: "HTTP",
        status: "online" as const,
        lastSeen: Date.now(),
        uptime: 98.7,
        cpuUsage: 34.6,
        memoryUsage: 55.8,
        networkTraffic: 203.4,
      },
    ];

    for (const device of devices) {
      const deviceId = await ctx.db.insert("devices", device);
      
      if (device.status === "warning") {
        await ctx.db.insert("alerts", {
          deviceId,
          deviceName: device.name,
          severity: "warning" as const,
          message: "High CPU and memory usage detected. Device may require maintenance.",
          type: "Performance",
          status: "active" as const,
          acknowledgedBy: null,
          resolvedAt: null,
        });
      }
    }

    return { success: true, devicesCreated: devices.length };
  },
});
