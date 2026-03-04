import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BPLog from '@/models/BPLog';
import { getSession } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API Key not configured. Please add GEMINI_API_KEY to your environment variables.' }, { status: 500 });
        }

        const genAI = new GoogleGenAI({ apiKey });

        await dbConnect();

        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch logs for the last 30 days sorted by latest first
        const logs = await BPLog.find({
            userId: session.userId,
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 });

        if (logs.length === 0) {
            return NextResponse.json({ response: 'You have no blood pressure logs in the last 30 days to analyze.' }, { status: 200 });
        }

        // Format logs for the prompt
        const logsText = logs.map(l =>
            `Date: ${l.createdAt.toISOString().split('T')[0]}, ` +
            `Time: ${l.createdAt.toISOString().split('T')[1].substring(0, 5)}, ` +
            `BP: ${l.systolic}/${l.diastolic} mmHg, HR: ${l.heartRate} bpm` +
            (l.note ? `, Note: ${l.note}` : '')
        ).join('\n');

        const prompt = `You are a helpful and professional AI physician assistant analyzing a patient's blood pressure logs from the last 30 days. 
Here are the logs:
${logsText}

Please provide:
1. A brief summary of the patient's blood pressure trends over this period.
2. Any notable insights or concerns (e.g., if there are frequent high readings).
3. General healthy lifestyle recommendations for managing blood pressure.

Keep your response friendly, clear, and easy to understand for a patient. Emphasize that you are an AI and this is not a substitute for professional medical advice. Format your response with clear paragraphs or bullet points where appropriate.`;

        // Generate content
        const apiResponse = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = apiResponse.text;

        return NextResponse.json({ response: textResponse }, { status: 200 });
    } catch (error: any) {
        console.error('AI Insights Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI insights', details: error?.message },
            { status: 500 }
        );
    }
}
