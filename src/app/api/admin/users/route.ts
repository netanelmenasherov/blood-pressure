import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import BPLog from '@/models/BPLog';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // Fetch all users sorted by latest creation
        const users = await User.find({})
            .select('-passwordHash') // Exclude password hash
            .sort({ createdAt: -1 })
            .lean();

        // Fetch log counts for each user (optional, but good for admin dashboard)
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const logCount = await BPLog.countDocuments({ userId: user._id });
            const lastLog = await BPLog.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt').lean();

            return {
                ...user,
                _id: user._id.toString(),
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                logCount,
                lastLogDate: lastLog ? lastLog.createdAt.toISOString() : null,
            };
        }));

        return NextResponse.json(usersWithStats, { status: 200 });
    } catch (error) {
        console.error('Get Users Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
