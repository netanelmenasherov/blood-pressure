
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BPLog from '@/models/BPLog';
import { getSession } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        // Ensure the log belongs to the user or user is admin
        const query = session.role === 'admin'
            ? { _id: id }
            : { _id: id, userId: session.userId };

        const deletedLog = await BPLog.findOneAndDelete(query);

        if (!deletedLog) {
            return NextResponse.json({ error: 'Log not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Log deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete Log Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
