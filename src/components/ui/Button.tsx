import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    href?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, href, ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 dark:shadow-none',
            secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
            outline: 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
            ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800',
            danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md shadow-red-200 dark:shadow-none',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm rounded-lg',
            md: 'h-11 px-6 text-base rounded-xl',
            lg: 'h-14 px-8 text-lg rounded-2xl',
        };

        const classes = cn(
            'relative inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900',
            variants[variant],
            sizes[size],
            className
        );

        if (href) {
            return (
                <Link href={href} className={classes}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {children}
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                disabled={disabled || isLoading}
                className={classes}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, cn };

