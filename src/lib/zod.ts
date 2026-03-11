import { z } from 'zod';

// File validation constants
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_PDF_TYPES = ['application/pdf'];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Voice IDs
export const VOICE_IDS = {
    dave: 'CYw3kZ02Hs0563khs1Fj',
    daniel: 'onwK4e9ZLuTAKqWW03F9',
    chris: 'iP95p4xoKVk53GoZ742B',
    rachel: '21m00Tcm4TlvDq8ikWAM',
    sarah: 'EXAVITQu4vr4xnSDxMaL',
} as const;

// File validation helpers
const pdfFileSchema = z
    .instanceof(File, { message: 'PDF file is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'PDF file must be less than 50MB')
    .refine(
        (file) => ACCEPTED_PDF_TYPES.includes(file.type),
        'Only PDF files are accepted'
    );

const coverImageSchema = z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Cover image must be less than 10MB')
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only JPG, PNG, and WebP images are accepted'
    )
    .optional();

// Voice validation
const voiceSchema = z.enum(['dave', 'daniel', 'chris', 'rachel', 'sarah']);

// Upload form schema
export const UploadSchema = z.object({
    pdfFile: pdfFileSchema,
    coverImage: coverImageSchema,
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    author: z.string().min(1, 'Author name is required').max(100, 'Author must be less than 100 characters'),
    voice: voiceSchema,
});

// Type for form values
export type UploadFormValues = z.infer<typeof UploadSchema>;

