import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-4">
          <span className="text-4xl">❤️</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Track Your Heart Health <span className="text-indigo-600 dark:text-indigo-400">Instantly</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          The simple, fast, and secure way to log your blood pressure.
          Get instant analysis and keep your doctor in the loop.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Link href="/login" className="w-full block">
          <Button size="lg" className="w-full shadow-lg shadow-indigo-200/50">
            Log In
          </Button>
        </Link>
        <Link href="/signup" className="w-full block">
          <Button variant="secondary" size="lg" className="w-full">
            Create Account
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12 opacity-80">
        <Card variant="solid" className="p-4 text-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Fast</h3>
          <p className="text-sm text-slate-500">Log in seconds</p>
        </Card>
        <Card variant="solid" className="p-4 text-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Secure</h3>
          <p className="text-sm text-slate-500">Private & Encrypted</p>
        </Card>
        <Card variant="solid" className="p-4 text-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Smart</h3>
          <p className="text-sm text-slate-500">Instant Analysis</p>
        </Card>
      </div>
    </div>
  );
}
