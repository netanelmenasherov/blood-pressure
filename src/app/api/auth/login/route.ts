import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, signToken, setSession } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT and set session
        const token = signToken({ userId: user._id.toString(), role: user.role });
        await setSession(token);

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save();

        return NextResponse.json(
            { message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
