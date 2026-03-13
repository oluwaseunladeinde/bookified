'use client'

import { Mic, MicOff } from "lucide-react";
import useVapi from "@/hooks/use-vapi";
import Transcript from "./transcript";
import { IBook } from "@/types";
import Image from "next/image";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VapiControls = ({ book }: { book: IBook }) => {
    const vapi = useVapi(book);

    const { clearErrors, currentMessage: vapiCurrentMessage, currentUserMessage: vapiCurrentUserMessage, start, stop, isActive, status, duration } = vapi;

    const getStatusDisplay = () => {
        switch (status) {
            case 'connecting': return { label: 'Connecting...', color: 'vapi-status-dot-connecting' };
            case 'starting': return { label: 'Starting...', color: 'vapi-status-dot-starting' };
            case 'listening': return { label: 'Listening', color: 'vapi-status-dot-listening' };
            case 'thinking': return { label: 'Thinking...', color: 'vapi-status-dot-thinking' };
            case 'speaking': return { label: 'Speaking', color: 'vapi-status-dot-speaking' };
            default: return { label: 'Ready', color: 'vapi-status-dot-ready' };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <>
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header card */}
                <section className="vapi-header-card">
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || '/assets/book-cover.svg'}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image"
                        />
                        <div className="vapi-mic-wrapper">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting'}
                                className="vapi-mic-btn vapi-mic-btn-inactive shadow-md">
                                {isActive ? (
                                    <Mic className="size-7 text-white" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">{book.title}</h1>
                        <p className="text-lg text-muted-foreground">by {book.author}</p>
                        <div className="flex flex-wrap gap-2">
                            <div className="vapi-status-indicator">
                                <div className="vapi-status-dot vapi-status-dot-ready" />
                                <span className="vapi-status-text">Ready</span>
                            </div>
                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">Voice: {book.persona || 'Default'}</span>
                            </div>
                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">0:00/15:00</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="vapi-transcript-wrapper bg-white rounded-xl p-4">
                    <Transcript
                        messages={vapi.messages}
                        currentMessage={vapiCurrentMessage}
                        currentUserMessage={vapiCurrentUserMessage}
                    />
                </div>
            </div>


        </>

    )
}

export default VapiControls;