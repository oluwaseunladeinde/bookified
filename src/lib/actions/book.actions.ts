"use server";

import { CreateBook, TextSegment } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import Book from "@/database/models/book.model";
import { escapeRegex, generateSlug, serializeData } from "@/lib/utils";
import BookSegment from "@/database/models/book-segment.model";


export const getAllBooks = async (search?: string) => {
    try {
        await connectToDatabase();

        let query = {};

        if (search) {
            const escapedSearch = escapeRegex(search);
            const regex = new RegExp(escapedSearch, 'i');
            query = {
                $or: [
                    { title: { $regex: regex } },
                    { author: { $regex: regex } },
                ]
            };
        }

        const books = await Book.find(query).sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: serializeData(books)
        }
    } catch (e) {
        console.error('Error connecting to database', e);
        return {
            success: false, error: e
        }
    }
}

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(title);

        const existingBook = await Book.findOne({ slug }).lean();

        if (existingBook) {
            return {
                exists: true,
                book: serializeData(existingBook)
            }
        }

        return {
            exists: false,
        }

    } catch (error) {
        console.error('Error checking book exists', error);
        return {
            exists: false, error
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({ slug }).lean();

        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true,
            }
        }

        //TODO: Check subscription limits here

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId || userId !== data.clerkId) {
            return { success: false, error: "Unauthorized" };
        }

        //const bookCount = await Book.countDocuments({ clerkId: userId });

        const book = await Book.create({ ...data, clerkId: userId, slug, totalSegments: 0 });

        return {
            success: true,
            data: serializeData(book),
            alreadyExists: false,
        }
    } catch (error) {
        console.error('Error creating a book', error);

        return {
            success: false,
            error,
        }
    }
}


export const saveBookSegments = async (
    bookId: string,
    segments: TextSegment[]) => {
    let session: import('mongoose').ClientSession | undefined;
    try {
        await connectToDatabase();

        // Get authenticated user from Clerk
        const { auth } = await import("@clerk/nextjs/server");
        const userId = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized: Not authenticated" };
        }

        // Load the book and verify ownership
        const book = await Book.findById(bookId);

        if (!book) {
            return { success: false, error: "Unauthorized: Book not found" };
        }

        if (book.clerkId !== userId) {
            return { success: false, error: "Unauthorized: You do not own this book" };
        }

        console.log('Saving book segments...');

        // Get mongoose connection for transaction
        const mongoose = await import('mongoose');
        const connection = mongoose.connection;
        session = await connection.startSession();

        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId: userId, bookId, content: text, segmentIndex, pageNumber, wordCount
        }));

        // Use transaction for atomic writes
        await session.withTransaction(async () => {
            await BookSegment.insertMany(segmentsToInsert, { session });
            await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length }, { session });
        });

        console.log('Book segments saved successfully.');

        return {
            success: true,
            data: { segmentsCreated: segments.length }
        }

    }
    catch (error) {
        console.error('Error saving book segments', error);

        // Abort transaction on error instead of deleting data
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return {
            success: false,
            error,
        }
    }
}

