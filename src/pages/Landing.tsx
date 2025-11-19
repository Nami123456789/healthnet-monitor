import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, CheckCircle, Loader2, Server, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight">Healthcare IoT Monitor</span>
            </div>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
                  <Button onClick={() => navigate("/auth")}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Shield className="h-4 w-4" />
              Zero Downtime Healthcare Monitoring
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Real-Time Healthcare IoT Network Monitoring
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ensure zero downtime for connected medical devices with enterprise-grade monitoring, 
              SNMP/NETCONF integration, and comprehensive observability dashboards.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="features" className="container mx-auto px-8 py-24 bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Comprehensive Monitoring Solution</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built on open-source technologies with enterprise-grade reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Device Management</h3>
                    <p className="text-muted-foreground">
                      Monitor all connected medical devices in real-time with SNMP and NETCONF protocol support.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Alert Lifecycle</h3>
                    <p className="text-muted-foreground">
                      Complete alert management from detection to resolution with acknowledgment tracking.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Observability</h3>
                    <p className="text-muted-foreground">
                      Real-time dashboards with metrics for CPU, memory, network traffic, and uptime monitoring.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Zero Downtime</h3>
                    <p className="text-muted-foreground">
                      Proactive monitoring ensures critical medical equipment stays online and operational.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Patient Safety</h3>
                    <p className="text-muted-foreground">
                      Improve patient outcomes by ensuring medical devices are always available when needed.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-8 pb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Open Source</h3>
                    <p className="text-muted-foreground">
                      Built on Zabbix and Grafana for transparent, customizable, and cost-effective monitoring.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-16 px-12 text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">
                  Ready to Improve Patient Safety?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Start monitoring your healthcare IoT network today with zero configuration required.
                </p>
                <Button size="lg" variant="secondary" onClick={handleGetStarted}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-semibold">Healthcare IoT Monitor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Zabbix, SNMP, NETCONF, and Grafana on Ubuntu
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}