# Design Sandbox

A lightweight prototyping environment built on **React + Vite + Tailwind + shadcn/ui**.
Open `localhost:5173` to see the prototype navigator.

---

## Quick Start

```bash
cd design-sandbox
npm install   # first time only
npm run dev   # starts dev server at http://localhost:5173
```

---

## Adding a New Prototype

1. **Copy the template**
   ```bash
   cp src/pages/_template.tsx src/pages/MyFlow.tsx
   ```

2. **Register the route** in `src/App.tsx`:
   ```tsx
   import MyFlow from "@/pages/MyFlow";
   // inside <Routes>:
   <Route path="/my-flow" element={<MyFlow />} />
   ```

3. **Add it to the navigator** in `src/pages/Index.tsx`:
   ```ts
   {
     title: "My Flow",
     description: "Short description of what this prototype covers",
     path: "/my-flow",
     status: "in-progress",
   }
   ```

4. Build your UI inside `src/pages/MyFlow.tsx`. All shadcn components and
   Tailwind utilities are available out of the box.

---

## Applying Your Brand Tokens

Two files control the entire visual theme:

| File | What to update |
|------|----------------|
| `src/index.css` | CSS variables (HSL values) consumed by shadcn components |
| `tailwind.config.ts` | `brand` object at the top — hex colors, font names, border radius |

Both files have `← replace` comments marking every placeholder value.

**Converting hex → HSL channels:**
`#0066FF` → `hsl(220, 100%, 50%)` → use as `"220 100% 50%"` in `index.css`.
(Online tool: https://www.w3schools.com/colors/colors_converter.asp)

---

## Adding More shadcn Components

```bash
npx shadcn@latest add <component-name>
# e.g. npx shadcn@latest add dialog
# e.g. npx shadcn@latest add dropdown-menu
# e.g. npx shadcn@latest add select
```

Components land in `src/components/ui/` and automatically inherit your brand tokens.

---

## Figma Integration

This project runs inside Cowork with the **Figma MCP** connected. Ask Claude to:

- *"Pull the design for the checkout screen from my Figma file [URL]"*
- *"Generate the component tree from this Figma frame"*
- *"Match the spacing and colors from this Figma node"*

Claude can read your Figma variables/styles and update `tailwind.config.ts` and
`src/index.css` directly with your real design tokens.

---

## Stack

| Tool | Version | Role |
|------|---------|------|
| Vite | 5.x | Dev server & bundler |
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility styling |
| shadcn/ui | latest | Pre-built accessible components |
| React Router | 6.x | Page routing |
| Radix UI | various | Headless primitives (via shadcn) |
| lucide-react | 0.44x | Icons |
