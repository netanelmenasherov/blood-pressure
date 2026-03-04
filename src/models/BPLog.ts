import mongoose, { Schema, Document, Model } from 'mongoose';
import { AlertLevel } from '@/lib/alerts';
import { encrypt, decrypt, encryptNumber, decryptNumber } from '@/lib/encryption';

export interface IBPLog extends Document {
    userId: mongoose.Types.ObjectId;
    systolic: number;
    diastolic: number;
    heartRate: number;
    sysAlert: AlertLevel;
    diaAlert: AlertLevel;
    hrAlert: AlertLevel;
    overallAlert: AlertLevel;
    note?: string;
    createdAt: Date;
}

const BPLogSchema: Schema<IBPLog> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a userId'],
    },
    systolic: {
        type: String as any,
        required: [true, 'Please provide systolic BP'],
        set: ((val: any) => encryptNumber(val)) as any,
        get: ((val: any) => decryptNumber(val)) as any,
    },
    diastolic: {
        type: String as any,
        required: [true, 'Please provide diastolic BP'],
        set: ((val: any) => encryptNumber(val)) as any,
        get: ((val: any) => decryptNumber(val)) as any,
    },
    heartRate: {
        type: String as any,
        required: [true, 'Please provide heart rate'],
        set: ((val: any) => encryptNumber(val)) as any,
        get: ((val: any) => decryptNumber(val)) as any,
    },
    sysAlert: {
        type: String as any,
        required: true,
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
    diaAlert: {
        type: String as any,
        required: true,
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
    hrAlert: {
        type: String as any,
        required: true,
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
    overallAlert: {
        type: String as any,
        required: true,
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
    note: {
        type: String as any,
        set: ((val: any) => encrypt(val)) as any,
        get: ((val: any) => decrypt(val)) as any,
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { getters: true }, // Ensure getters run on output
    toObject: { getters: true },
});

// Check if the model already exists to prevent overwrite errors during hot reloading
const BPLog: Model<IBPLog> = mongoose.models.BPLog || mongoose.model<IBPLog>('BPLog', BPLogSchema);

export default BPLog;
