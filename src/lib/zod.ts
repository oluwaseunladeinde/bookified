import { z } from 'zod';

// Import shared constants from the single source of truth
import {
    MAX_FILE_SIZE,
    MAX_IMAGE_SIZE,
    ACCEPTED_PDF_TYPES,
    ACCEPTED_IMAGE_TYPES,
    VOICE_IDS
} from './constants';

// Re-export for backwards compatibility with existing consumers
export { MAX_FILE_SIZE, MAX_IMAGE_SIZE, ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES, VOICE_IDS };

// File validation helpers
const pdfFileSchema = z
    .instanceof(File, { error: 'PDF file is required' })
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

// Voice validation using VOICE_IDS keys
const voiceSchema = z.enum(Object.keys(VOICE_IDS) as [keyof typeof VOICE_IDS, ...(keyof typeof VOICE_IDS)[]]);

// Upload form schema
export const UploadSchema = z.object({
    pdfFile: pdfFileSchema,
    coverImage: coverImageSchema,
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    author: z.string().trim().min(1, 'Author name is required').max(100, 'Author must be less than 100 characters'),
    persona: voiceSchema,
});

// Type for form values
export type UploadFormValues = z.infer<typeof UploadSchema>;

