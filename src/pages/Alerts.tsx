import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Activity, AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Alerts() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const alerts = useQuery(api.alerts.list, { status: statusFilter });
  const acknowledgeAlert = useMutation(api.alerts.acknowledge);
  const resolveAlert = useMutation(api.alerts.resolve);

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

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert({ id: id as any });
      toast.success("Alert acknowledged");
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveAlert({ id: id as any });
      toast.success("Alert resolved");
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Alert Management</h1>
                <p className="text-sm text-muted-foreground">Monitor and respond to system alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/devices")}>
                Devices
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
              <p className="text-muted-foreground mt-2">Total: {alerts?.length || 0} alerts</p>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!alerts || alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No alerts found</h3>
                <p className="text-muted-foreground">All systems operating normally</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {alert.severity === "critical" && <XCircle className="h-6 w-6 text-red-600" />}
                          {alert.severity === "warning" && <AlertTriangle className="h-6 w-6 text-yellow-600" />}
                          {alert.severity === "info" && <Activity className="h-6 w-6 text-blue-600" />}
                          <div>
                            <CardTitle className="text-lg">{alert.deviceName}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{alert.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            alert.severity === "critical" ? "bg-red-100 text-red-700" :
                            alert.severity === "warning" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {alert.severity}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            alert.status === "active" ? "bg-red-100 text-red-700" :
                            alert.status === "acknowledged" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{alert.message}</p>
                      {alert.acknowledgedBy && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Acknowledged by: {alert.acknowledgedBy}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {alert.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert._id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alert.status !== "resolved" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleResolve(alert._id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
