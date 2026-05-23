import React from "react";
import { motion } from "framer-motion";
import { Layers, Shield } from "lucide-react";

function DepartmentHeatmap({ data }) {
    const departments = ["Engineering", "Finance", "Sales", "Operations"];
    
    const getDeptStats = (deptName) => {
        const deptEmps = (Array.isArray(data) ? data : []).filter(e => e.department === deptName);
        if (deptEmps.length === 0) return { risk: 0, count: 0 };
        const avgRisk = deptEmps.reduce((acc, curr) => acc + curr.final_risk, 0) / deptEmps.length;
        return { risk: avgRisk, count: deptEmps.length };
    };

    const getHeatColor = (risk) => {
        if (risk > 0.6) return "bg-accent-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]";
        if (risk > 0.3) return "bg-accent-amber shadow-[0_0_15px_rgba(245,158,11,0.2)]";
        if (risk > 0) return "bg-accent-emerald shadow-[0_0_15px_rgba(16,185,129,0.1)]";
        return "bg-slate-200 dark:bg-white/5";
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-display font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Organization Health</h4>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-textMuted uppercase mt-1">Cross-Dept Threat Density</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-surface bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white ring-1 ring-white/10">EX</div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {departments.map((dept) => {
                    const stats = getDeptStats(dept);
                    return (
                        <div key={dept} className="p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-all cursor-default">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-slate-400 dark:text-textMuted uppercase tracking-widest">{dept}</span>
                                <div className={`w-2.5 h-2.5 rounded-full ${getHeatColor(stats.risk)}`} />
                            </div>
                            <div className="mt-4">
                                <div className="text-xl font-display font-black text-slate-900 dark:text-white leading-none">{(stats.risk * 100).toFixed(0)}%</div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-textMuted uppercase mt-1">{stats.count} ACTIVE NODES</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex items-center gap-3 p-3 rounded-2xl bg-accent-emerald/5 border border-accent-emerald/20">
                <Shield size={14} className="text-accent-emerald shrink-0" />
                <p className="text-[10px] font-bold text-accent-emerald uppercase leading-tight tracking-wide">
                    Neural monitoring active across all core sectors.
                </p>
            </div>
        </motion.div>
    );
}

export default DepartmentHeatmap;
