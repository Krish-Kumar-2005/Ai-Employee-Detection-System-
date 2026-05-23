import React, { useState, useEffect } from "react";
import { getEmployeeRisk } from "./services/api";
import KPICards from "./components/KPICards";
import RiskChart from "./components/RiskChart";
import UploadBehaviorLogs from "./components/UploadBehaviorLogs";
import UploadTextLogs from "./components/UploadTextLogs";
import DepartmentHeatmap from "./components/DepartmentHeatmap";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Shield, Bell, Moon, Sun, Monitor, Lock, Activity, Search, AlertTriangle, X } from "lucide-react";

function App() {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const res = await getEmployeeRisk();
      const resData = Array.isArray(res) ? res : [];
      setData(resData);

      // Notification logic for new High Risk nodes
      const highRisk = resData.filter(e => e.final_risk > 0.7);
      if (highRisk.length > 0) {
        setNotifications(prev => [...highRisk.map(h => ({ id: h.employee_id, msg: `Critical Threat: ${h.employee_id}` })), ...prev].slice(0, 5));
      }

    } catch (e) {
      console.error(e);
      toast.error("Gadaar Node Offline", { description: "Re-establishing connection..." });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${darkMode ? 'dark bg-background text-textMain' : 'bg-slate-50 text-slate-900 font-medium'}`}>
      <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} richColors closeButton />

      {/* Global Design Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-rose/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Premium Navigation */}
      <nav className="sticky top-0 z-[100] w-full flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 glass-panel px-8 py-4 flex items-center justify-between border-white/10 pointer-events-auto w-full max-w-7xl mx-6 shadow-2xl relative overflow-visible"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="p-2.5 rounded-xl bg-primary text-white shadow-glow group-hover:scale-110 transition-all duration-300">
                <Shield size={24} />
              </div>
              <h1 className="text-xl font-display font-black tracking-tighter uppercase italic">
                Gadaar <span className="text-primary not-italic tracking-normal">Employee</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {['Dashboard', 'Neural Matrix', 'Active Nodes', 'Registry'].map((item) => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-primary text-white shadow-glow' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-textMuted hover:text-primary'}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent-rose rounded-full border-2 border-surface animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-72 glass-panel p-5 z-[110] shadow-2xl border-white/20"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity size={12} className="text-primary" />
                        Security Feed
                      </div>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-primary transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                          <div key={i} className="text-[11px] font-bold p-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose flex items-center gap-3">
                            <AlertTriangle size={14} />
                            {n.msg}
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] font-bold text-slate-400 dark:text-textMuted uppercase py-4 text-center">Threat Level: Nominal</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-textMuted hover:text-primary transition-all overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}><Sun size={20} /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}><Moon size={20} /></motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-0">
        {/* Hero / Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4"
            >
              <Monitor size={12} />
              Security Operations Center
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-black tracking-tight leading-[0.9] text-slate-900 dark:text-white"
            >
              INSIDER THREAT<br />
              <span className="text-primary italic">DETECTION</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel px-6 py-4 border-primary/20 flex items-center gap-4 shadow-glow"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">System Status</p>
              <p className="text-sm font-bold uppercase tracking-tight">Encrypted & Operational</p>
            </div>
          </motion.div>
        </div>

        {/* KPI & Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <KPICards data={data} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UploadBehaviorLogs onUploadSuccess={fetchData} />
              <UploadTextLogs onUploadSuccess={fetchData} />
            </div>
          </div>
          <div className="lg:col-span-4 min-h-[400px]">
            <DepartmentHeatmap data={data} />
          </div>
        </div>

        {/* Analytics Section */}
        <RiskChart data={data} isFetching={isFetching} />

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-slate-200 dark:border-white/10 text-center pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-textMuted">
            Powered by Gadaar Neural Intelligence • v2.1.0-PREMIUM
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
