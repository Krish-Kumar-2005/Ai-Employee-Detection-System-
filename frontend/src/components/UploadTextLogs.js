import React, { useState, useRef } from "react";
import { uploadTextLogs } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Upload, FileText, Loader2, MessageSquare, CheckCircle2, RotateCcw } from "lucide-react";

function UploadTextLogs({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (fileToUpload) => {
        if (!fileToUpload) return;
        setIsUploading(true);
        setIsSuccess(false);
        const loadingToast = toast.loading('Fusing linguistic patterns...');

        try {
            await uploadTextLogs(fileToUpload);
            toast.success('Sentiment Matrix Fused', { 
                id: loadingToast, 
                description: 'Sentiment signals have been successfully integrated.',
                duration: 4000
            });
            setIsSuccess(true);
            if (onUploadSuccess) onUploadSuccess();
        } catch (e) {
            console.error(e);
            toast.error('Sync Error', { 
                id: loadingToast, 
                description: 'Failed to reach Gadaar Node.' 
            });
            setFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const resetState = (e) => {
        if (e) e.stopPropagation();
        setFile(null);
        setIsSuccess(false);
    };

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            handleUpload(droppedFile);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-1 relative group overflow-hidden"
        >
            <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploading && !isSuccess && fileInputRef.current.click()}
                className={`relative z-10 border-2 border-dashed rounded-[1.8rem] p-8 transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    isUploading ? 'cursor-wait' : isSuccess ? 'cursor-default border-accent-emerald bg-accent-emerald/5' : 'cursor-pointer border-slate-200 dark:border-white/5 hover:border-primary/50 hover:bg-white/50 dark:hover:bg-white/5'
                } ${isDragging ? 'border-primary bg-primary/5' : ''}`}
            >
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={onFileChange}
                    accept=".csv"
                />

                <AnimatePresence mode="wait">
                    {isUploading ? (
                        <motion.div 
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center text-center"
                        >
                            <Loader2 className="text-primary animate-spin mb-4" size={48} />
                            <span className="text-sm font-black text-primary uppercase tracking-[0.2em] animate-pulse">Analyzing Sentiments...</span>
                        </motion.div>
                    ) : isSuccess ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-accent-emerald/20 flex items-center justify-center text-accent-emerald mb-4 ring-1 ring-accent-emerald/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="text-lg font-display font-black text-accent-emerald uppercase tracking-tight mb-1">Signal Integrated</h4>
                            <p className="text-xs text-slate-500 dark:text-textMuted font-mono font-bold truncate max-w-[220px] mb-6">
                                {file?.name}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetState}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all"
                            >
                                <RotateCcw size={14} />
                                New Import
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-textMuted mb-4 group-hover:text-primary transition-colors group-hover:scale-110 duration-500">
                                <MessageSquare size={32} />
                            </div>
                            <h4 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Sentiment Scanner</h4>
                            <p className="text-xs text-slate-500 dark:text-textMuted font-bold uppercase tracking-wider mb-6 px-4">
                                Drop .CSV to analyze linguistic signals
                            </p>
                            
                            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-glow transition-all">
                                <Upload size={14} />
                                Browse Logs
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 {/* Subtle scanning line effect on hover */}
                 <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 ${isUploading ? 'opacity-100 animate-scan' : ''} pointer-events-none`} />
            </div>
        </motion.div>
    );
}

export default UploadTextLogs;
