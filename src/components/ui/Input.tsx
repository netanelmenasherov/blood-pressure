import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-offset-slate-950 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-600 shadow-sm transition-all duration-200",
                            error && "border-red-500 ring-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="text-sm font-medium text-red-500 ml-1 animate-fade-in">{error}</p>
                ) : helperText ? (
                    <p className="text-sm text-slate-500 ml-1">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
