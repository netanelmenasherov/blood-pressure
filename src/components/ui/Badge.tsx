import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertLevel } from '@/lib/alerts';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AlertBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    level: AlertLevel;
    size?: 'sm' | 'md' | 'lg';
}

const AlertBadge = forwardRef<HTMLSpanElement, AlertBadgeProps>(
    ({ className, level, size = 'sm', children, ...props }, ref) => {

        // Map of background, text, and optional border/ring colors
        const colors = {
            [AlertLevel.NORMAL]: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
            [AlertLevel.ELEVATED]: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20',
            [AlertLevel.HIGH]: 'bg-orange-100 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
            [AlertLevel.CRITICAL]: 'bg-red-100 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
        };

        const sizes = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-0.5 text-sm',
            lg: 'px-3 py-1 text-base',
        };

        const labels = {
            [AlertLevel.NORMAL]: 'Normal',
            [AlertLevel.ELEVATED]: 'Elevated',
            [AlertLevel.HIGH]: 'High',
            [AlertLevel.CRITICAL]: 'Critical',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full font-medium ring-1 ring-inset",
                    colors[level],
                    sizes[size],
                    className
                )}
                {...props}
            >
                <span className={cn(
                    "mr-1.5 flex h-2 w-2 rounded-full",
                    level === AlertLevel.NORMAL && "bg-green-600 dark:bg-green-400",
                    level === AlertLevel.ELEVATED && "bg-yellow-600 dark:bg-yellow-400",
                    level === AlertLevel.HIGH && "bg-orange-600 dark:bg-orange-400",
                    level === AlertLevel.CRITICAL && "bg-red-600 dark:bg-red-400 animate-pulse"
                )}></span>
                {children || labels[level]}
            </span>
        );
    }
);

AlertBadge.displayName = "AlertBadge";

export { AlertBadge };
