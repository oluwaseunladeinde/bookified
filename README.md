# Bookify - AI Voice Companion for Your Books

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)](https://mongodb.com)
[![Vapi AI](https://img.shields.io/badge/Vapi%20AI-FF6B35?logo=chatbot)](https://vapi.ai)

**Bookify** is an AI-powered web application that transforms your books into interactive voice companions. Upload a book (PDF), and chat with it using natural voice conversations powered by Vapi AI and 11Labs voices. Perfect for book discussions, summaries, or immersive reading experiences.

## ✨ Features

- 📚 **Book Upload & Processing**: Upload PDFs, auto-extract cover, segment into text chunks (pages/words tracked).
- 🎤 **Voice AI Chat**: Real-time voice conversations with your book using Vapi AI. Custom personas/voices.
- 🔍 **Smart Search**: Text search across book segments (MongoDB text index + regex fallback).
- 👥 **User Auth**: Clerk integration with subscription-ready limits (books/sessions).
- 📱 **Responsive UI**: shadcn/ui components, Tailwind CSS, mobile-friendly.
- ☁️ **File Storage**: Vercel Blob for books/covers.
- ⏱️ **Session Tracking**: Voice session durations for billing/subscriptions.

## 🛠️ Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/oluwaseunladeinde/bookify.git bookify
   cd bookify
   npm install
   ```

2. **Environment Variables** (`.env.local`)
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_VAPI_API_KEY=your_vapi_key
   VERCEL_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📋 Detailed Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas (or local)
- [Clerk](https://clerk.com) account
- [Vapi.ai](https://vapi.ai) assistant/server setup
- Vercel account (for Blob storage)

### Environment Variables
| Key | Description | Required |
|-----|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `NEXT_PUBLIC_VAPI_API_KEY` | Vapi API key | ✅ |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | Vercel Blob token | ✅ |

### Database Schemas
- **Book**: title, slug, author, persona, fileURL, totalSegments
- **BookSegment**: content chunks, page/word metadata (text-indexed)
- **VoiceSession**: user/book sessions, duration tracking

## 🚀 Usage

1. **Sign up** via Clerk at `/`
2. **Upload book** using the form (auto-processes segments)
3. **Voice chat**: Go to `/books/[slug]`, click mic 🟢
4. AI knows book content, responds in custom voice/persona.

Demo flow:
```
Upload \"Pride & Prejudice\" → /books/pride-prejudice → \"Hey, have you read it yet?\"
```

## 🏗️ Architecture

```
Upload PDF → Vercel Blob → Extract segments (pdfjs) → Save Book/Segments (Mongoose)
Voice Chat (/books/[slug]):
  useVapi hook → Vapi.start(assistant, {bookId}) → searchBookSegments API → Transcript UI
```

Server Actions: `createBook`, `saveBookSegments`, `searchBookSegments`

## 🌐 Deployment

Deploy to Vercel in 2 clicks:
1. Connect GitHub repo
2. Add env vars in Vercel dashboard
3. Deploy! Blob/DB auto-configure.

[Deploy Button](https://vercel.com/new/clone?repository-url=https://github.com/oluwaseunladeinde/bookify&env=MONGODB_URI,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_VAPI_API_KEY,VERCEL_BLOB_READ_WRITE_TOKEN&project-name=bookify)

## 🔮 Roadmap

- [ ] Subscription tiers (limits on books/sessions)
- [ ] Multi-book conversations
- [ ] TTS improvements (more voices)
- [ ] Book recommendations

## 🤝 Contributing

1. Fork & PR
2. `npm run lint`
3. Update tests if needed

## 📄 License

MIT
