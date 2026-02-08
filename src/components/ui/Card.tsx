import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-3xl border border-slate-200 p-6 md:p-8 transition-shadow duration-300",
                    variant === 'glass'
                        ? 'glass dark:glass'
                        : 'bg-white dark:bg-slate-900 border-none shadow-sm dark:shadow-md dark:border-slate-800',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card };
