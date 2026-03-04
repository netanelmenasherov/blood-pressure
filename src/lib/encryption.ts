import crypto from 'crypto';

// Ensure 32 bytes for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'development_secret_key_32_bytes_x!';
const IV_LENGTH = 16;

const getKey = () => Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

export function encrypt(text: string | null | undefined): string | null | undefined {
    if (!text || typeof text !== 'string') return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        return text;
    }
}

export function decrypt(text: string | null | undefined): string | null | undefined {
    if (!text || typeof text !== 'string' || !text.includes(':')) return text;
    try {
        const textParts = text.split(':');
        const ivHex = textParts.shift();
        if (!ivHex) return text;
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', getKey(), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return text; // Return original if decryption fails (e.g. data before encryption was enabled)
    }
}

// For fields that need to be searchable like email
export function encryptDeterministic(text: string | null | undefined): string | null | undefined {
    if (!text || typeof text !== 'string') return text;
    try {
        const iv = Buffer.alloc(IV_LENGTH, 0); // Static IV
        const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        return text;
    }
}

export function decryptDeterministic(text: string | null | undefined): string | null | undefined {
    return decrypt(text);
}

export function encryptNumber(num: number | string | null | undefined): string | null | undefined {
    if (num === null || num === undefined) return num as any;
    return encrypt(num.toString());
}

export function decryptNumber(text: string | number | null | undefined): number | null | undefined {
    if (text === null || text === undefined) return text as any;
    if (typeof text === 'number') return text; // already a number
    const dec = decrypt(text);
    return dec ? Number(dec) : 0;
}
