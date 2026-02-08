import mongoose, { Schema, Document, Model } from 'mongoose';

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
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        maxlength: [100, 'Email cannot be more than 100 characters'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
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
});

// Check if the model already exists to prevent overwrite errors during hot reloading
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
