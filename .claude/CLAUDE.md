# Design Sandbox

## How to Add a New Page

This is a React + Vite + TypeScript project with Tailwind CSS and shadcn/ui components. React Router handles routing.

### Steps to add a new page/prototype:

1. **Copy the template**:
   ```bash
   cp src/pages/_template.tsx src/pages/MyNewPage.tsx
   ```

2. **Register the route** in `src/App.tsx`:
   ```tsx
   import MyNewPage from "@/pages/MyNewPage";
   // Inside <Routes>:
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```

3. **Add to the navigator** in `src/pages/Index.tsx`:
   ```ts
   const prototypes: Prototype[] = [
     {
       title: "My New Page",
       description: "Short description of what this prototype covers",
       path: "/my-new-page",
       status: "in-progress", // or "ready" or "archived"
     },
   ];
   ```

4. **Build the UI** in the new page file using available components and Tailwind utilities.

### Page structure convention
Every page has a sticky nav bar at the top (with back link + title), and a main canvas area with `max-w-5xl mx-auto px-6 py-12`.

### Key files
- `src/App.tsx` — route registry
- `src/pages/Index.tsx` — prototype card navigator
- `src/pages/_template.tsx` — copy this for new pages
- `src/index.css` — theme CSS variables (HSL format)
- `tailwind.config.ts` — Tailwind theme config

### Dev commands
- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build
- `npx shadcn@latest add <component>` — add new shadcn components
