import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { auth } from '@clerk/nextjs/server';
import VapiControls from '@/components/vapi-controls';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: PageProps) {
    const { slug } = await params;
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    const bookResult = await getBookBySlug(slug);

    if (!bookResult.success || !bookResult.data) {
        redirect('/');
    }

    return (
        <main className="book-page-container">
            {/* Floating back button */}
            <Link href="/" className="back-btn-floating">
                <ArrowLeft className="w-6 h-6 text-[#212a3b]" />
            </Link>
            <VapiControls book={bookResult.data} />
        </main>
    );
}
