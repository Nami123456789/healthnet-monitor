import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, AlertTriangle, CheckCircle, Loader2, Server, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const devices = useQuery(api.devices.list);
  const alerts = useQuery(api.alerts.list, {});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const onlineDevices = devices?.filter(d => d.status === "online").length || 0;
  const offlineDevices = devices?.filter(d => d.status === "offline").length || 0;
  const warningDevices = devices?.filter(d => d.status === "warning").length || 0;
  const activeAlerts = alerts?.filter(a => a.status === "active").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Healthcare IoT Monitor</h1>
                <p className="text-sm text-muted-foreground">Real-time network monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" onClick={() => navigate("/devices")}>
                Devices
              </Button>
              <Button variant="outline" onClick={() => navigate("/alerts")}>
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Online Devices</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{onlineDevices}</div>
                <p className="text-xs text-muted-foreground mt-1">Operating normally</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Warning Devices</CardTitle>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{warningDevices}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Offline Devices</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{offlineDevices}</div>
                <p className="text-xs text-muted-foreground mt-1">Connection lost</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
                <Activity className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeAlerts}</div>
                <p className="text-xs text-muted-foreground mt-1">Needs response</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Recent Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!devices || devices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No devices registered</p>
                    <Button className="mt-4" onClick={() => navigate("/devices")}>
                      Add Device
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {devices.slice(0, 5).map((device) => (
                      <div key={device._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`h-3 w-3 rounded-full ${
                            device.status === "online" ? "bg-green-600" :
                            device.status === "warning" ? "bg-yellow-600" : "bg-red-600"
                          }`} />
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.type} • {device.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{device.uptime.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!alerts || alerts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                    <p className="text-sm mt-2">All systems operating normally</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.slice(0, 5).map((alert) => (
                      <div key={alert._id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {alert.severity === "critical" && <XCircle className="h-4 w-4 text-red-600" />}
                            {alert.severity === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            {alert.severity === "info" && <Activity className="h-4 w-4 text-blue-600" />}
                            <span className="font-medium text-sm">{alert.deviceName}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.status === "active" ? "bg-red-100 text-red-700" :
                            alert.status === "acknowledged" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
