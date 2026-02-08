'use client';

import { format } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { AlertBadge } from '@/components/ui/Badge';
import { IBPLog } from '@/models/BPLog';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BPLogListProps {
    logs: IBPLog[];
    loading: boolean;
    onDelete: (id: string) => void;
}

export default function BPLogList({ logs, loading, onDelete }: BPLogListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <p>No logs found. Add your first reading above!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <Card key={String(log._id)} className="p-4 flex flex-col gap-3 relative overflow-hidden group" variant="solid">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                {format(new Date(log.createdAt), 'MMM d, yyyy · h:mm a')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertBadge level={log.overallAlert} />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this log?')) {
                                        onDelete(String(log._id));
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-end gap-6 mt-1">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-0.5">BP (mmHg)</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {log.systolic}
                                </span>
                                <span className="text-lg text-slate-400">/</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {log.diastolic}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-0.5">Heart Rate</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    {log.heartRate}
                                </span>
                                <span className="text-xs text-slate-500">BPM</span>
                            </div>
                        </div>
                    </div>

                    {log.note && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                &quot;{log.note}&quot;
                            </p>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
