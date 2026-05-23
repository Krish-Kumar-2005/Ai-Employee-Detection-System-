import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Activity, TrendingUp, ShieldCheck } from 'lucide-react';

function KPICards({ data }) {
    const safeData = Array.isArray(data) ? data : [];
    const totalEmployees = safeData.length;
    const criticalThreats = safeData.filter(d => d.final_risk > 0.6).length;
    const averageRisk = totalEmployees > 0
        ? (safeData.reduce((acc, curr) => acc + curr.final_risk, 0) / totalEmployees).toFixed(2)
        : "0.00";

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { 
                staggerChildren: 0.1,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 200, damping: 20 } 
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
            {/* Total Employees - Large Bento */}
            <motion.div 
                variants={itemVariants} 
                className="md:col-span-2 glass-panel p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                        <Users size={24} />
                    </div>
                    <p className="text-slate-500 dark:text-textMuted text-xs font-black uppercase tracking-[0.2em] mb-2">Workforce Scale</p>
                    <div className="text-5xl font-display font-black text-slate-900 dark:text-white mb-2 leading-none">{totalEmployees}</div>
                    <div className="flex items-center gap-1.5 text-accent-emerald text-sm font-bold">
                        <TrendingUp size={14} />
                        <span>Monitored Nodes</span>
                    </div>
                </div>
            </motion.div>

            {/* Critical Threats - Scanning Bento */}
            <motion.div 
                variants={itemVariants} 
                className={`md:col-span-2 glass-panel p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform ${criticalThreats > 0 ? 'ring-2 ring-accent-rose animate-glow-error' : ''}`}
            >
                {criticalThreats > 0 && (
                    <motion.div
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-rose/20 to-transparent h-1/2 z-0 pointer-events-none"
                    />
                )}
                <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ring-1 ${criticalThreats > 0 ? 'bg-accent-rose/10 text-accent-rose ring-accent-rose/20' : 'bg-accent-emerald/10 text-accent-emerald ring-accent-emerald/20'}`}>
                        {criticalThreats > 0 ? <AlertTriangle size={24} className="animate-pulse" /> : <ShieldCheck size={24} />}
                    </div>
                    <p className="text-slate-500 dark:text-textMuted text-xs font-black uppercase tracking-[0.2em] mb-2">High Risk Roster</p>
                    <div className="text-5xl font-display font-black text-slate-900 dark:text-white mb-2 leading-none">{criticalThreats}</div>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${criticalThreats > 0 ? 'text-accent-rose' : 'text-accent-emerald'}`}>
                        {criticalThreats > 0 ? 'Anomalies Detected' : 'All Signals Nominal'}
                    </div>
                </div>
            </motion.div>

            {/* Average Risk - Compact Bento */}
            <motion.div 
                variants={itemVariants} 
                className="md:col-span-2 glass-panel p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform"
            >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-amber/20 transition-colors" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-accent-amber/10 flex items-center justify-center text-accent-amber mb-6 ring-1 ring-accent-amber/20">
                        <Activity size={24} />
                    </div>
                    <p className="text-slate-500 dark:text-textMuted text-xs font-black uppercase tracking-[0.2em] mb-2">Aggregate Risk</p>
                    <div className="text-5xl font-display font-black text-slate-900 dark:text-white mb-2 leading-none">{averageRisk}</div>
                    <div className="flex items-center gap-1.5 text-accent-amber text-sm font-bold uppercase tracking-widest opacity-80">
                         Fusion Confidence: 94%
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default KPICards;
