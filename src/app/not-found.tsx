import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">404</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Page Not Found</p>
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Return Home
            </Link>
        </div>
    )
}
