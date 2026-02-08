import mongoose, { Schema, Document, Model } from 'mongoose';
import { AlertLevel } from '@/lib/alerts';

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
        type: Number,
        required: [true, 'Please provide systolic BP'],
        min: [50, 'Systolic BP must be at least 50'],
        max: [300, 'Systolic BP cannot exceed 300'],
    },
    diastolic: {
        type: Number,
        required: [true, 'Please provide diastolic BP'],
        min: [30, 'Diastolic BP must be at least 30'],
        max: [200, 'Diastolic BP cannot exceed 200'],
    },
    heartRate: {
        type: Number,
        required: [true, 'Please provide heart rate'],
        min: [30, 'Heart rate must be at least 30'],
        max: [220, 'Heart rate cannot exceed 220'],
    },
    sysAlert: {
        type: String,
        enum: Object.values(AlertLevel),
        required: true,
    },
    diaAlert: {
        type: String,
        enum: Object.values(AlertLevel),
        required: true,
    },
    hrAlert: {
        type: String,
        enum: Object.values(AlertLevel),
        required: true,
    },
    overallAlert: {
        type: String,
        enum: Object.values(AlertLevel),
        required: true,
    },
    note: {
        type: String,
        maxlength: [200, 'Note cannot be more than 200 characters'],
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});

// Check if the model already exists to prevent overwrite errors during hot reloading
const BPLog: Model<IBPLog> = mongoose.models.BPLog || mongoose.model<IBPLog>('BPLog', BPLogSchema);

export default BPLog;
