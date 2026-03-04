'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import BPLogForm from '@/components/dashboard/BPLogForm';
import BPLogList from '@/components/dashboard/BPLogList';
import { IBPLog } from '@/models/BPLog';
import { LogOut, Plus, X, Download, Bot } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/export';

export default function DashboardPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<IBPLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // AI Insights State
    const [aiInsights, setAiInsights] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/logs');
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const handleLogSuccess = () => {
        setShowAddForm(false);
        fetchLogs();
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLogs(logs.filter(log => String(log._id) !== id));
            } else {
                alert('Failed to delete log');
            }
        } catch (error) {
            console.error('Failed to delete log', error);
            alert('Error deleting log');
        }
    };

    const fetchAiInsights = async () => {
        try {
            setAiLoading(true);
            setAiError(null);
            setAiInsights(null);
            const res = await fetch('/api/ai/insights');
            const data = await res.json();

            if (res.ok && data.response) {
                setAiInsights(data.response);
            } else {
                setAiError(data.error || 'Failed to fetch AI insights. Please check if your GEMINI_API_KEY is configured.');
            }
        } catch (error: any) {
            console.error('Failed to get insights', error);
            setAiError('An unexpected error occurred while fetching AI insights.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 animate-fade-in">
            <header className="flex items-center justify-between py-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your health overview</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Recent Logs</h2>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => exportToExcel(logs)}
                            size="sm"
                            variant="outline"
                            title="Export to Excel"
                        >
                            <Download className="h-4 w-4 mr-1" /> Excel
                        </Button>
                        <Button
                            onClick={() => exportToPDF(logs)}
                            size="sm"
                            variant="outline"
                            title="Export to PDF"
                        >
                            <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                        <Button
                            onClick={fetchAiInsights}
                            size="sm"
                            variant="outline"
                            title="AI Doctor Insights"
                            disabled={aiLoading}
                        >
                            <Bot className="h-4 w-4 mr-1" /> {aiLoading ? 'Thinking...' : 'AI Doctor'}
                        </Button>
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            size="sm"
                            variant={showAddForm ? "secondary" : "primary"}
                        >
                            {showAddForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                            {showAddForm ? 'Cancel' : 'Add Log'}
                        </Button>
                    </div>
                </div>

                {showAddForm && (
                    <div className="mb-8">
                        <BPLogForm onSuccess={handleLogSuccess} />
                    </div>
                )}

                {(aiInsights || aiError || aiLoading) && (
                    <div className="mb-8 p-6 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center">
                                <Bot className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                AI Doctor Insights
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => { setAiInsights(null); setAiError(null); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {aiLoading && (
                            <div className="flex animate-pulse space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-blue-200 dark:bg-slate-600 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-blue-200 dark:bg-slate-600 rounded"></div>
                                        <div className="h-4 bg-blue-200 dark:bg-slate-600 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {aiError && (
                            <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                {aiError}
                            </div>
                        )}

                        {aiInsights && (
                            <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {aiInsights}
                            </div>
                        )}
                    </div>
                )}

                <BPLogList logs={logs} loading={loading} onDelete={handleDelete} />
            </main>
        </div>
    );
}
