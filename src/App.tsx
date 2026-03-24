import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Overview from "@/pages/Overview";
import LoadingSpinner from "@/pages/LoadingSpinner";

// ─────────────────────────────────────────────────────────────────────────────
// ADD NEW PROTOTYPE ROUTES HERE
//
// 1. Create a new file in src/pages/ (copy _template.tsx to get started)
// 2. Import it below
// 3. Add a <Route> entry
// 4. It will automatically appear on the home page navigator
//
// Example:
//   import Checkout from "@/pages/Checkout";
//   <Route path="/checkout" element={<Checkout />} />
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        {/* ── Prototype routes ── */}
        <Route path="/overview" element={<Overview />} />
        <Route path="/loading-spinner" element={<LoadingSpinner />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
