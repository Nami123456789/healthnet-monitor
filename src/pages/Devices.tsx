import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Activity, Loader2, Plus, Server, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Devices() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const devices = useQuery(api.devices.list);
  const createDevice = useMutation(api.devices.create);
  const removeDevice = useMutation(api.devices.remove);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    ipAddress: "",
    location: "",
    protocol: "SNMP",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDevice(formData);
      toast.success("Device added successfully");
      setOpen(false);
      setFormData({
        name: "",
        type: "",
        ipAddress: "",
        location: "",
        protocol: "SNMP",
      });
    } catch (error) {
      toast.error("Failed to add device");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeDevice({ id: id as any });
      toast.success("Device removed");
    } catch (error) {
      toast.error("Failed to remove device");
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
                <h1 className="text-2xl font-bold tracking-tight">Device Management</h1>
                <p className="text-sm text-muted-foreground">Monitor and manage IoT devices</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
              <p className="text-muted-foreground mt-2">Total: {devices?.length || 0} devices</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>Register a new IoT device for monitoring</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Device Name</Label>
                      <Input
                        id="name"
                        placeholder="MRI Scanner A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Device Type</Label>
                      <Input
                        id="type"
                        placeholder="Medical Imaging"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ip">IP Address</Label>
                      <Input
                        id="ip"
                        placeholder="192.168.1.100"
                        value={formData.ipAddress}
                        onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Building A, Floor 3"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="protocol">Protocol</Label>
                      <Select value={formData.protocol} onValueChange={(value) => setFormData({ ...formData, protocol: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SNMP">SNMP</SelectItem>
                          <SelectItem value="NETCONF">NETCONF</SelectItem>
                          <SelectItem value="HTTP">HTTP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Device</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {!devices || devices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Server className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No devices registered</h3>
                <p className="text-muted-foreground mb-6">Add your first IoT device to start monitoring</p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <motion.div
                  key={device._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            device.status === "online" ? "bg-green-600" :
                            device.status === "warning" ? "bg-yellow-600" : "bg-red-600"
                          }`} />
                          <CardTitle className="text-lg">{device.name}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(device._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium">{device.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">IP Address</span>
                          <span className="font-mono text-xs">{device.ipAddress}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location</span>
                          <span className="font-medium">{device.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Protocol</span>
                          <span className="font-medium">{device.protocol}</span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Uptime</span>
                            <span className="text-sm font-medium">{device.uptime.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">CPU</span>
                            <span className="text-sm font-medium">{device.cpuUsage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Memory</span>
                            <span className="text-sm font-medium">{device.memoryUsage.toFixed(1)}%</span>
                          </div>
                        </div>
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
