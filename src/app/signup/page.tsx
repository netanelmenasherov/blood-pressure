'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-600 dark:text-slate-400">Start tracking your health today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="name"
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        helperText="Must be at least 6 characters"
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-fade-in dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400">
                        Log in
                    </Link>
                </div>
            </Card>
        </div>
    );
}
