import mongoose, { Schema, Document, Model } from 'mongoose';
import { encrypt, decrypt, encryptDeterministic, decryptDeterministic } from '@/lib/encryption';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String as any,
        required: [true, 'Please provide a name'],
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
    email: {
        type: String as any,
        required: [true, 'Please provide an email'],
        unique: true,
        set: ((val: any) => encryptDeterministic(val)) as any,
        get: ((val: any) => decryptDeterministic(val)) as any,
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { getters: true }, // Ensure getters run on output
    toObject: { getters: true },
});

// Check if the model already exists to prevent overwrite errors during hot reloading
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
