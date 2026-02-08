'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import BPLogForm from '@/components/dashboard/BPLogForm';
import BPLogList from '@/components/dashboard/BPLogList';
import { IBPLog } from '@/models/BPLog';
import { LogOut, Plus, X, Download } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/export';

export default function DashboardPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<IBPLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

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

                <BPLogList logs={logs} loading={loading} onDelete={handleDelete} />
            </main>
        </div>
    );
}
