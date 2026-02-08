import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, signToken, setSession } from '@/lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const parsed = signupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation Error', details: parsed.error.format() },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        // specific validation: Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
            role: 'user', // default role
        });

        const token = signToken({ userId: user._id.toString(), role: user.role });
        await setSession(token);

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
