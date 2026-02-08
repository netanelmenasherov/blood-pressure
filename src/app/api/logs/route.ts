import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BPLog from '@/models/BPLog';
import { getSession } from '@/lib/auth';
import { calculateAlerts } from '@/lib/alerts';
import { z } from 'zod';

const logSchema = z.object({
    systolic: z.number().min(50).max(300),
    diastolic: z.number().min(30).max(200),
    heartRate: z.number().min(30).max(220),
    note: z.string().max(200).optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const parsed = logSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { systolic, diastolic, heartRate, note } = parsed.data;

        // Calculate alerts server-side
        const alerts = calculateAlerts(systolic, diastolic, heartRate);

        const log = await BPLog.create({
            userId: session.userId,
            systolic,
            diastolic,
            heartRate,
            ...alerts,
            note,
        });

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        console.error('Create Log Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch logs sorted by latest first
        const logs = await BPLog.find({ userId: session.userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to 50 for now, could add pagination later

        return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        console.error('Get Logs Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
