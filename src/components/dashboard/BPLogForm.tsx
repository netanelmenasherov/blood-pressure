'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Heart, Activity, Watch } from 'lucide-react';

interface BPLogFormProps {
    onSuccess: () => void;
}

export default function BPLogForm({ onSuccess }: BPLogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        note: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                systolic: Number(formData.systolic),
                diastolic: Number(formData.diastolic),
                heartRate: Number(formData.heartRate),
                note: formData.note || undefined,
            };

            const res = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.details?._errors?.join(', ') || data.error || 'Failed to save log');
            }

            setFormData({ systolic: '', diastolic: '', heartRate: '', note: '' });
            onSuccess();
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-6 animate-fade-in" variant="glass">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                    Log Reading
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Input
                            id="systolic"
                            label="SYS (mmHg)"
                            type="number"
                            placeholder="120"
                            value={formData.systolic}
                            onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                            required
                            min="50"
                            max="300"
                            className="pl-9"
                        />
                        <Activity className="absolute left-3 top-[2.4rem] h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <Input
                            id="diastolic"
                            label="DIA (mmHg)"
                            type="number"
                            placeholder="80"
                            value={formData.diastolic}
                            onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                            required
                            min="30"
                            max="200"
                            className="pl-9"
                        />
                        <Activity className="absolute left-3 top-[2.4rem] h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative col-span-2 md:col-span-1">
                        <Input
                            id="heartRate"
                            label="Heart Rate (BPM)"
                            type="number"
                            placeholder="72"
                            value={formData.heartRate}
                            onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                            required
                            min="30"
                            max="220"
                            className="pl-9"
                        />
                        <Watch className="absolute left-3 top-[2.4rem] h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <Input
                    id="note"
                    label="Note (Optional)"
                    placeholder="e.g. After workout"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    maxLength={200}
                />

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-fade-in dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full flex items-center justify-center gap-2" isLoading={loading} size="lg">
                    Save Reading
                </Button>
            </form>
        </Card>
    );
}
