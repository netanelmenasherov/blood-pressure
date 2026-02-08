'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Something went wrong!</h2>
                <p className="text-slate-600 dark:text-slate-400">We apologize for the inconvenience.</p>
            </div>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="mx-auto"
            >
                Try again
            </Button>
        </div>
    )
}
