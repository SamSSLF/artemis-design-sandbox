/**
 * PROTOTYPE TEMPLATE
 * ──────────────────
 * 1. Duplicate this file and rename it (e.g. Checkout.tsx)
 * 2. Update the title and description below
 * 3. Build your prototype in the <main> section
 * 4. Register it in App.tsx + Index.tsx
 */

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrototypeName() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav bar ── */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <span className="text-muted-foreground/40 text-sm">|</span>
          <span className="text-sm font-medium">Prototype Name</span>
        </div>
      </nav>

      {/* ── Canvas ── */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* ↓ Build your prototype below ↓ */}
        <div className="rounded-xl border-2 border-dashed border-border p-20 text-center text-muted-foreground">
          <p className="font-medium mb-2">Your prototype goes here</p>
          <p className="text-sm">Replace this placeholder with your UI</p>
        </div>
      </main>
    </div>
  );
}
