'use server';

import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurrentBillingPeriodStart } from "../subscription-constants";

export const startVoiceSession = async (
    clerkId: string,
    bookId: string
): Promise<StartSessionResult> => {
    try {

        await connectToDatabase();

        //TODO: Check the user limit to see if they can start a new session

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            status: 'active',
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            duration: 0,
        })


        return {
            success: true,
            sessionId: session._id.toString(),
            // maxDurationMinutes: limits.maxDurationPerSession,
        }
    } catch (error) {
        console.error('Error starting voice session', error);
        return {
            success: false,
            error: 'Failed to start voice session. Please try again later.'
        }
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();
        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if (!result) return { success: false, error: 'Voice session not found.' }

        return { success: true }
    } catch (error) {
        console.error('Error ending voice session', error);
        return { success: false, error: 'Failed to end voice session. Please try again later.' }
    }
}