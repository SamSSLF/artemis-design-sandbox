import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────────────────────────
// ARTEMIS BRAND TOKENS
// Source: artemis-ui-tokens/2 Theme.json + 3. Mode/{Light,Dark}.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Shadcn semantic tokens (driven by CSS vars in index.css)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        "med-warning": {
          DEFAULT: "hsl(var(--med-warning))",
          foreground: "hsl(var(--med-warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        "low-warning": {
          DEFAULT: "hsl(var(--low-warning))",
          foreground: "hsl(var(--low-warning-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Sidebar
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // Chart colors (light mode, from artemis-ui-tokens)
        chart: {
          "1": "#EA580C",
          "2": "#0D9488",
          "3": "#164E63",
          "4": "#FBBF24",
          "5": "#F59E0B",
        },
      },

      // ── Border Radius ────────────────────────────────────────────────────
      // Source: Theme.json > radius. --radius = 0.625rem (10px = rounded-lg).
      borderRadius: {
        "4xl": "2rem",                              /* 32px */
        "3xl": "1.5rem",                            /* 24px */
        "2xl": "1rem",                              /* 16px */
        xl:    "0.875rem",                          /* 14px */
        lg:    "var(--radius)",                     /* 10px */
        md:    "calc(var(--radius) - 2px)",         /*  8px */
        sm:    "calc(var(--radius) - 4px)",         /*  6px */
        xs:    "0.125rem",                          /*  2px */
      },

      // ── Typography ───────────────────────────────────────────────────────
      // Source: Theme.json > font
      fontFamily: {
        sans:  ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
        mono:  ["Hack", "ui-monospace", "SFMono-Regular", "monospace"],
      },

      // ── Font Sizes ───────────────────────────────────────────────────────
      // Source: Theme.json > text (px → rem, with matching line-heights)
      fontSize: {
        xs:    ["0.75rem",  { lineHeight: "1rem"    }],  /* 12/16 */
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],  /* 14/20 */
        base:  ["1rem",     { lineHeight: "1.5rem"  }],  /* 16/24 */
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],  /* 18/28 */
        xl:    ["1.25rem",  { lineHeight: "1.75rem" }],  /* 20/28 */
        "2xl": ["1.5rem",   { lineHeight: "2rem"    }],  /* 24/32 */
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],  /* 30/36 */
        "4xl": ["2.25rem",  { lineHeight: "2.5rem"  }],  /* 36/40 */
        "5xl": ["3rem",     { lineHeight: "1"       }],  /* 48    */
        "6xl": ["3.75rem",  { lineHeight: "1"       }],  /* 60    */
        "7xl": ["4.5rem",   { lineHeight: "1"       }],  /* 72    */
        "8xl": ["6rem",     { lineHeight: "1"       }],  /* 96    */
        "9xl": ["8rem",     { lineHeight: "1"       }],  /* 128   */
      },
    },
  },
  plugins: [],
};

export default config;
