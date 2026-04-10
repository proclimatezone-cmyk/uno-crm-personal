# UNO CRM - Phase 2 Implementation

A modern, high-performance CRM system built with **Next.js 16**, **Supabase**, and **Framer Motion**. Designed for elegance, efficiency, and scale.

## ✨ Core Features

*   **Premium Kanban Board:** Smooth, interactive drag-and-drop experience powered by `@hello-pangea/dnd`.
*   **Intelligent Automation:** Integrated webhooks for automated proposal generation via Make.com.
*   **Multilingual Support:** Full i18n support for English, Russian, and Uzbek.
*   **Real-time Sync:** Powered by Supabase for instant updates across the board.
*   **Modern UI:** Sleek glassmorphism effects, serif typography, and accessible dark mode.
*   **Secured Workflow:** SSR-protected routes and role-based access control.

## 🚀 Tech Stack

*   **Frontend:** Next.js 16 (App Router), Tailwind CSS
*   **Animations:** Framer Motion (fast 0.2s transitions)
*   **State Management:** Zustand
*   **Backend/Auth:** Supabase (Postgres, Auth, Edge Functions)
*   **Icons:** Lucide React

## ⚙️ Setup & Installation

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MAKE_WEBHOOK_URL=your_make_webhook_url
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

## 📈 Quality Assurance

This project has undergone comprehensive QA testing, including:
- [x] Full TypeScript strict type checking.
- [x] Production build verification.
- [x] Linting and code style enforcement.
- [x] Middleware resilience testing.

---
Built with ❤️ for **UNO CRM**.
