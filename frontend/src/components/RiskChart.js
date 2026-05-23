import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, FileText, DownloadCloud, Activity, LayoutGrid, List, Zap, MessageSquare, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Minus, Play, History } from "lucide-react";
import { generateIncidentReport, generateMasterReport } from "../utils/pdfGenerator";

function RiskChart({ data, isFetching }) {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'
    const [modalTab, setModalTab] = useState('insights'); // 'insights' or 'simulator'
    const [simScores, setSimScores] = useState({ behavior: 0, nlp: 0 });
    const chartData = data || [];

    useEffect(() => {
        if (selectedEmployee) {
            setSimScores({ 
                behavior: selectedEmployee.behavior_score, 
                nlp: selectedEmployee.nlp_score 
            });
            setModalTab('insights');
        }
    }, [selectedEmployee]);

    const simulatedRisk = roundScore(0.6 * simScores.behavior + 0.4 * simScores.nlp);

    function roundScore(val) {
        return Math.round(val * 10000) / 10000;
    }

    // Skeleton Loader rendering
    if (isFetching && chartData.length === 0) {
        return (
            <div className="mt-8 space-y-8 animate-pulse">
                <div className="bg-surface border border-white/5 rounded-3xl p-8 h-[500px]">
                    <div className="h-full w-full bg-white/5 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface/80 dark:bg-surface/80 border border-white/10 p-5 rounded-2xl shadow-glass backdrop-blur-xl z-50 ring-1 ring-white/5">
                    <p className="font-display font-black text-white mb-3 text-sm tracking-widest uppercase">ID: {label}</p>
                    <div className="space-y-3">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center gap-6">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-textMuted">{entry.name}</span>
                                    <span className="font-mono font-bold text-white text-xs">{Number(entry.value).toFixed(4)}</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${entry.value * 100}%` }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const getRiskStyles = (risk) => {
        if (risk > 0.6) return { color: '#F43F5E', bg: 'bg-accent-rose/10', border: 'border-accent-rose/20', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' };
        if (risk > 0.3) return { color: '#F59E0B', bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' };
        return { color: '#10B981', bg: 'bg-accent-emerald/10', border: 'border-accent-emerald/20', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' };
    };

    const InsightIcon = ({ type }) => {
        switch (type) {
            case 'technical_anomaly': return <Zap size={14} className="text-primary" />;
            case 'linguistic_signaling': return <MessageSquare size={14} className="text-accent-amber" />;
            case 'critical_alert': return <AlertTriangle size={14} className="text-accent-rose animate-pulse" />;
            case 'nominal_baseline': return <ShieldCheck size={14} className="text-accent-emerald" />;
            default: return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8 relative">
            
            {/* Header Controls */}
             <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6 mb-8 px-2">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                        Signal Fusion Analytics
                        <div className="flex items-center gap-1 text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-md uppercase tracking-widest ring-1 ring-primary/30">
                            Live
                        </div>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-textMuted font-medium mt-1">
                        Historical anomalies and predictive threat assessment.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-surface/50 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <button 
                        onClick={() => setViewMode('chart')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'chart' ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                    >
                        <List size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => generateMasterReport(chartData)}
                        className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl transition-colors disabled:opacity-50"
                        disabled={chartData.length === 0}
                    >
                        <DownloadCloud size={16} />
                        EXPORT ALL
                    </motion.button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'chart' ? (
                    <motion.div 
                        key="chart-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="glass-panel p-8"
                    >
                        <div className="h-[450px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis 
                                        dataKey="employee_id" 
                                        stroke="#94A3B8" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
                                    />
                                    <YAxis 
                                        stroke="#94A3B8" 
                                        domain={[0, 1]} 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="final_risk" name="Fused Threat" radius={[12, 12, 4, 4]} maxBarSize={60}>
                                        {chartData.map((entry, index) => {
                                            const styles = getRiskStyles(entry.final_risk);
                                            return <Cell key={`cell-${index}`} fill={styles.color} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="list-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="glass-panel overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                        <th className="p-6 text-[10px] font-black text-slate-500 dark:text-textMuted uppercase tracking-[0.2em] whitespace-nowrap">Identifier</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 dark:text-textMuted uppercase tracking-[0.2em] whitespace-nowrap text-center w-32">Trends</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 dark:text-textMuted uppercase tracking-[0.2em] whitespace-nowrap text-center">Insights</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 dark:text-textMuted uppercase tracking-[0.2em] whitespace-nowrap text-right">Fusion Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {chartData.map((row) => {
                                        const styles = getRiskStyles(row.final_risk);
                                        const trendColor = (row.history?.length > 1 && row.history[row.history.length-1] > row.history[row.history.length-2]) ? '#F43F5E' : '#10B981';
                                        
                                        return (
                                            <tr
                                                key={row.employee_id}
                                                onClick={() => setSelectedEmployee(row)}
                                                className="hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer group"
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center font-mono text-[10px] font-bold text-primary ring-1 ring-white/10 group-hover:ring-primary/40 transition-all text-center">
                                                            {String(row.employee_id).slice(-2)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-mono font-black text-slate-900 dark:text-white text-sm tracking-tight group-hover:translate-x-1 transition-transform">
                                                                {row.employee_id}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 dark:text-textMuted uppercase tracking-wider">{row.department}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="h-8 w-24 mx-auto">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={row.history?.map((v, i) => ({ v, i })) || []}>
                                                                <Area 
                                                                    type="monotone" 
                                                                    dataKey="v" 
                                                                    stroke={trendColor} 
                                                                    strokeWidth={2}
                                                                    fill={trendColor} 
                                                                    fillOpacity={0.1} 
                                                                    isAnimationActive={false}
                                                                />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {row.insights?.map((ins, i) => (
                                                            <div key={i} className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center ring-1 ring-white/5 hover:ring-white/20 transition-all cursor-help" title={ins.replace('_', ' ').toUpperCase()}>
                                                                <InsightIcon type={ins} />
                                                            </div>
                                                        ))}
                                                        {(!row.insights || row.insights.length === 0) && <Minus size={14} className="text-slate-200 dark:text-white/10" />}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className={`inline-flex items-center px-4 py-1.5 rounded-xl border-2 font-mono font-black text-xs transition-all ${styles.bg} ${styles.border} ${styles.glow}`} style={{ color: styles.color }}>
                                                        {Number(row.final_risk * 100).toFixed(1)}%
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drill Down Modal */}
            <AnimatePresence>
                {selectedEmployee && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                        onClick={() => setSelectedEmployee(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20, rotateX: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20, rotateX: 10 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-surface border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden ring-1 ring-white/5"
                        >
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="absolute top-6 right-6 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-textMuted z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-rose via-accent-amber to-accent-emerald" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-glow">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Signal Analysis</h2>
                                    <p className="text-xs font-mono text-slate-500 dark:text-textMuted font-bold uppercase tracking-widest">{selectedEmployee.employee_id} • {selectedEmployee.department}</p>
                                </div>
                            </div>

                            {/* Modal Tabs */}
                            <div className="flex gap-2 mb-8 bg-slate-50 dark:bg-white/5 p-1 rounded-2xl w-fit">
                                <button 
                                    onClick={() => setModalTab('insights')}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${modalTab === 'insights' ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                                >
                                    <History size={14} />
                                    Signals
                                </button>
                                <button 
                                    onClick={() => setModalTab('simulator')}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${modalTab === 'simulator' ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                                >
                                    <Play size={14} />
                                    Simulator
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {modalTab === 'insights' ? (
                                    <motion.div key="insights" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-background/50 border border-slate-100 dark:border-white/5 relative group">
                                                <div className="absolute top-4 right-4 text-[9px] font-black text-slate-300 dark:text-white/5 group-hover:text-primary transition-colors">BEHAVIOR</div>
                                                <h4 className="text-[10px] font-black text-slate-400 dark:text-textMuted uppercase mb-3 tracking-widest">Weight: 60%</h4>
                                                <div className="flex justify-between items-end mb-4">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-white">Heuristic Score</span>
                                                    <span className="font-mono text-xl font-black text-primary">{Number(selectedEmployee.behavior_score).toFixed(3)}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${selectedEmployee.behavior_score * 100}%` }} />
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-background/50 border border-slate-100 dark:border-white/5 relative group">
                                                <div className="absolute top-4 right-4 text-[9px] font-black text-slate-300 dark:text-white/5 group-hover:text-primary transition-colors">NLP</div>
                                                <h4 className="text-[10px] font-black text-slate-400 dark:text-textMuted uppercase mb-3 tracking-widest">Weight: 40%</h4>
                                                <div className="flex justify-between items-end mb-4">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-white">Sentiment Signal</span>
                                                    <span className="font-mono text-xl font-black text-primary">{Number(selectedEmployee.nlp_score).toFixed(3)}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${selectedEmployee.nlp_score * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="h-40 w-full mb-8 rounded-3xl bg-slate-50 dark:bg-background/20 p-4 border border-slate-100 dark:border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={selectedEmployee.history?.map((v, i) => ({ v, i })) || []}>
                                                    <defs>
                                                        <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                                    <XAxis hide dataKey="i" />
                                                    <YAxis hide domain={[0, 1]} />
                                                    <Tooltip content={<div className="bg-surface p-2 rounded-lg text-[10px] font-mono text-white ring-1 ring-white/10">RISK: VALUE</div>} />
                                                    <Area type="monotone" dataKey="v" stroke="#6366F1" fill="url(#historyGradient)" strokeWidth={3} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="simulator" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8 py-4">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-textMuted tracking-widest">Simulate Behavior Pattern</label>
                                                    <span className="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{simScores.behavior.toFixed(3)}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="1" step="0.001" 
                                                    value={simScores.behavior}
                                                    onChange={(e) => setSimScores({ ...simScores, behavior: parseFloat(e.target.value) })}
                                                    className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-textMuted tracking-widest">Simulate Linguistic Signal</label>
                                                    <span className="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{simScores.nlp.toFixed(3)}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="1" step="0.001" 
                                                    value={simScores.nlp}
                                                    onChange={(e) => setSimScores({ ...simScores, nlp: parseFloat(e.target.value) })}
                                                    className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-primary text-white rounded-2xl shadow-glow">
                                                    <Zap size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Projected Threat Fusion</p>
                                                    <p className="text-xl font-display font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Scenario Result</p>
                                                </div>
                                            </div>
                                            <div className="text-4xl font-display font-black text-primary italic">
                                                {(simulatedRisk * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={`p-8 rounded-[2rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${getRiskStyles(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk).bg} ${getRiskStyles(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk).border} ${getRiskStyles(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk).glow}`}>
                                <div className="text-center md:text-left">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Verdict Baseline</span>
                                    <h3 className="text-2xl font-display font-black uppercase italic tracking-tight" style={{ color: getRiskStyles(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk).color }}>
                                        {(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk) > 0.6 ? 'PROBABLE THREAT' : (modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk) > 0.3 ? 'ELEVATED RISK' : 'NOMINAL STATUS'}
                                    </h3>
                                </div>
                                <div className="text-5xl font-display font-black leading-none" style={{ color: getRiskStyles(modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk).color }}>
                                    {Number((modalTab === 'simulator' ? simulatedRisk : selectedEmployee.final_risk) * 100).toFixed(1)}<span className="text-xl ml-1">%</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => generateIncidentReport(selectedEmployee)}
                                    className="flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl bg-slate-900 border border-white/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-black uppercase tracking-widest transition-all shadow-xl"
                                >
                                    <FileText size={20} />
                                    <span>Download Evidence</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedEmployee(null)}
                                    className="px-8 py-5 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-textMuted font-black uppercase tracking-widest transition-all"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

export default RiskChart;
