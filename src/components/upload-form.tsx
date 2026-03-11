"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Image, X, FileText, Loader2 } from "lucide-react";
import { UploadSchema, type UploadFormValues, VOICE_IDS } from "@/lib/zod";
import { cn } from "@/lib/utils";

// Voice options with descriptions
const maleVoices = [
    { id: "dave" as const, name: "Dave", description: "Young male, British-Essex, casual & conversational" },
    { id: "daniel" as const, name: "Daniel", description: "Middle-aged male, British, authoritative but warm" },
    { id: "chris" as const, name: "Chris", description: "Male, casual & easy-going" },
];

const femaleVoices = [
    { id: "rachel" as const, name: "Rachel", description: "Young female, American, calm & clear" },
    { id: "sarah" as const, name: "Sarah", description: "Young female, American, soft & approachable" },
];

interface FileUploadState {
    file: File | null;
    fileName: string;
}

const LoadingOverlay = () => (
    <div className="loading-wrapper">
        <div className="loading-shadow-wrapper bg-white">
            <div className="loading-shadow">
                <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
                <p className="loading-title">Processing Your Book</p>
                <div className="loading-progress">
                    <div className="loading-progress-item">
                        <span className="loading-progress-status"></span>
                        <span className="text-[#3d485e]">Uploading PDF...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface FileDropzoneProps {
    icon: "upload" | "image";
    text: string;
    hint: string;
    file: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    accept: string;
}

const FileDropzone = ({
    icon: IconType,
    text,
    hint,
    file,
    onFileSelect,
    onFileRemove,
    accept,
}: FileDropzoneProps) => {
    const handleClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                onFileSelect(target.files[0]);
            }
        };
        input.click();
    };

    return (
        <div
            className={cn(
                "upload-dropzone border-2 border-dashed border-[#d4c4a8]",
                file && "upload-dropzone-uploaded"
            )}
            onClick={handleClick}
        >
            {file ? (
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                        {IconType === "upload" ? (
                            <FileText className="upload-dropzone-icon" />
                        ) : (
                            <Image className="upload-dropzone-icon" />
                        )}
                    </div>
                    <p className="upload-dropzone-text font-medium">{file.name}</p>
                    <button
                        type="button"
                        className="upload-dropzone-remove mt-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileRemove();
                        }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    {IconType === "upload" ? (
                        <Upload className="upload-dropzone-icon" />
                    ) : (
                        <Image className="upload-dropzone-icon" />
                    )}
                    <p className="upload-dropzone-text">{text}</p>
                    <p className="upload-dropzone-hint">{hint}</p>
                </div>
            )}
        </div>
    );
};

interface VoiceOptionProps {
    id: "dave" | "daniel" | "chris" | "rachel" | "sarah";
    name: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

const VoiceOption = ({ id, name, description, isSelected, onSelect }: VoiceOptionProps) => (
    <div
        className={cn(
            "voice-selector-option bg-white",
            isSelected && "voice-selector-option-selected"
        )}
        onClick={onSelect}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
            }
        }}
    >
        <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-[#212a3b]">{name}</span>
            <span className="text-xs text-[#3d485e] mt-1 line-clamp-2">{description}</span>
        </div>
    </div>
);

const UploadForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pdfFile, setPdfFile] = useState<FileUploadState>({ file: null, fileName: "" });
    const [coverImage, setCoverImage] = useState<FileUploadState>({ file: null, fileName: "" });

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            pdfFile: undefined,
            coverImage: undefined,
            title: "",
            author: "",
            voice: "rachel",
        },
    });

    const selectedVoice = watch("voice");

    const handlePdfSelect = useCallback(
        (file: File) => {
            setPdfFile({ file, fileName: file.name });
            setValue("pdfFile", file, { shouldValidate: true });
        },
        [setValue]
    );

    const handlePdfRemove = useCallback(() => {
        setPdfFile({ file: null, fileName: "" });
        setValue("pdfFile", undefined as unknown as File, { shouldValidate: true });
    }, [setValue]);

    const handleCoverSelect = useCallback(
        (file: File) => {
            setCoverImage({ file, fileName: file.name });
            setValue("coverImage", file, { shouldValidate: true });
        },
        [setValue]
    );

    const handleCoverRemove = useCallback(() => {
        setCoverImage({ file: null, fileName: "" });
        setValue("coverImage", undefined as unknown as File, { shouldValidate: true });
    }, [setValue]);

    const onSubmit = async (data: UploadFormValues) => {
        setIsSubmitting(true);
        console.log("Form submitted:", data);
        console.log("PDF file:", data.pdfFile);
        console.log("Cover image:", data.coverImage);
        console.log("Voice ID:", VOICE_IDS[data.voice]);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsSubmitting(false);
    };

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <form onSubmit={handleSubmit(onSubmit)} className="new-book-wrapper space-y-8">
                {/* PDF File Upload */}
                <div>
                    <label className="form-label">Upload PDF</label>
                    <Controller
                        name="pdfFile"
                        control={control}
                        render={({ field }) => (
                            <FileDropzone
                                icon="upload"
                                text="Click to upload PDF"
                                hint="PDF file (max 50MB)"
                                file={pdfFile.file}
                                onFileSelect={handlePdfSelect}
                                onFileRemove={handlePdfRemove}
                                accept=".pdf,application/pdf"
                            />
                        )}
                    />
                    {errors.pdfFile && (
                        <p className="text-red-500 text-sm mt-2">{errors.pdfFile.message as string}</p>
                    )}
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className="form-label">Cover Image</label>
                    <Controller
                        name="coverImage"
                        control={control}
                        render={({ field }) => (
                            <FileDropzone
                                icon="image"
                                text="Click to upload cover image"
                                hint="Leave empty to auto-generate from PDF"
                                file={coverImage.file}
                                onFileSelect={handleCoverSelect}
                                onFileRemove={handleCoverRemove}
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            />
                        )}
                    />
                    {errors.coverImage && (
                        <p className="text-red-500 text-sm mt-2">{errors.coverImage.message as string}</p>
                    )}
                </div>

                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="title"
                                type="text"
                                placeholder="ex: Rich Dad Poor Dad"
                                className={cn(
                                    "form-input",
                                    errors.title && "border-red-500 focus:border-red-500"
                                )}
                            />
                        )}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
                    )}
                </div>

                {/* Author Input */}
                <div>
                    <label htmlFor="author" className="form-label">
                        Author Name
                    </label>
                    <Controller
                        name="author"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="author"
                                type="text"
                                placeholder="ex: Robert Kiyosaki"
                                className={cn(
                                    "form-input",
                                    errors.author && "border-red-500 focus:border-red-500"
                                )}
                            />
                        )}
                    />
                    {errors.author && (
                        <p className="text-red-500 text-sm mt-2">{errors.author.message}</p>
                    )}
                </div>

                {/* Voice Selector */}
                <div>
                    <label className="form-label">Choose Assistant Voice</label>

                    {/* Male Voices */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-[#3d485e] mb-2">Male Voices</p>
                        <Controller
                            name="voice"
                            control={control}
                            render={({ field }) => (
                                <div className="voice-selector-options">
                                    {maleVoices.map((voice) => (
                                        <VoiceOption
                                            key={voice.id}
                                            id={voice.id}
                                            name={voice.name}
                                            description={voice.description}
                                            isSelected={field.value === voice.id}
                                            onSelect={() => field.onChange(voice.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    {/* Female Voices */}
                    <div>
                        <p className="text-sm font-medium text-[#3d485e] mb-2">Female Voices</p>
                        <Controller
                            name="voice"
                            control={control}
                            render={({ field }) => (
                                <div className="voice-selector-options">
                                    {femaleVoices.map((voice) => (
                                        <VoiceOption
                                            key={voice.id}
                                            id={voice.id}
                                            name={voice.name}
                                            description={voice.description}
                                            isSelected={field.value === voice.id}
                                            onSelect={() => field.onChange(voice.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    {errors.voice && (
                        <p className="text-red-500 text-sm mt-2">{errors.voice.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="form-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        "Begin Synthesis"
                    )}
                </button>
            </form>
        </>
    );
};

export default UploadForm;

