import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";

/* ── Configuration ────────────────────────────────────────────────────────── */

const speeds = [
  { label: "Slow", value: "2s", ms: 2000 },
  { label: "Normal", value: "1s", ms: 1000 },
  { label: "Fast", value: "0.5s", ms: 500 },
];

const sizes = [
  { label: "S", value: 30 },
  { label: "M", value: 50 },
  { label: "L", value: 80 },
  { label: "XL", value: 120 },
];

const colors = [
  { label: "Foreground", cssVar: "--foreground", hex: "#020617" },
  { label: "Primary", cssVar: "--primary", hex: "#635CCC" },
  { label: "Info", cssVar: "--info", hex: "#2563EB" },
  { label: "Success", cssVar: "--success", hex: "#16A34A" },
  { label: "Destructive", cssVar: "--destructive", hex: "#DC2626" },
];

/* ── Loader Component ─────────────────────────────────────────────────────── */

function Loader({
  size,
  speed,
  color,
}: {
  size: number;
  speed: string;
  color: (typeof colors)[0];
}) {
  const blockSize = Math.max(8, Math.round(size * 0.32));
  const border = Math.max(1, Math.round(size * 0.04));
  const id = `loader-${size}-${speed}-${color.label}`.replace(/[\s.]/g, "-");
  const fill = `hsl(var(${color.cssVar}) / 0.3)`;

  return (
    <>
      <style>{`
        @keyframes l3-${id} {
          100% { background-position: -${blockSize}px -${blockSize}px, ${blockSize}px ${blockSize}px }
        }
        .${id} {
          width: ${size}px;
          aspect-ratio: 1;
          border: ${border}px solid ${fill};
          background:
            conic-gradient(from -90deg at calc(100% - ${border}px) calc(100% - ${border}px), transparent 0 90deg, ${fill} 0),
            conic-gradient(from -90deg at calc(100% - ${border}px) calc(100% - ${border}px), transparent 0 90deg, ${fill} 0);
          background-size: ${blockSize}px ${blockSize}px;
          background-position: 0 0;
          animation: l3-${id} ${speed} infinite;
        }
      `}</style>
      <div className={id} />
    </>
  );
}

/* ── Copy CSS hook ─────────────────────────────────────────────────────────── */

function useCopyCss() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (css: string) => {
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = css;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}

/* ── Control Button ───────────────────────────────────────────────────────── */

function ControlButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-lg text-sm transition-all border ${
        selected
          ? "border-primary bg-primary/10 font-semibold text-primary"
          : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function LoadingSpinner() {
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showInContext, setShowInContext] = useState(false);
  const { copied, copy } = useCopyCss();

  const currentSpeed = speeds[selectedSpeed];
  const currentSize = sizes[selectedSize];
  const currentColor = colors[selectedColor];

  const blockSize = Math.max(8, Math.round(currentSize.value * 0.32));
  const borderW = Math.max(1, Math.round(currentSize.value * 0.04));

  const cssSnippet = `.loader {
  width: ${currentSize.value}px;
  aspect-ratio: 1;
  border: ${borderW}px solid ${currentColor.hex}4D;
  --c: conic-gradient(
    from -90deg
    at calc(100% - ${borderW}px)
       calc(100% - ${borderW}px),
    transparent 0 90deg, ${currentColor.hex}4D 0
  );
  background: var(--c), var(--c);
  background-size: ${blockSize}px ${blockSize}px;
  background-position: 0 0;
  animation: spin ${currentSpeed.value} infinite;
}

@keyframes spin {
  100% {
    background-position:
      -${blockSize}px -${blockSize}px,
       ${blockSize}px  ${blockSize}px;
  }
}`;

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
          <span className="text-sm font-medium">Loading Spinner</span>
        </div>
      </nav>

      {/* ── Canvas ── */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Preview */}
        <div className="rounded-xl border bg-card flex items-center justify-center min-h-[200px] p-12 mb-8">
          {!showInContext ? (
            <Loader
              size={currentSize.value}
              speed={currentSpeed.value}
              color={currentColor}
            />
          ) : (
            <div className="text-center w-full max-w-xs">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4" />
              <div className="h-3 bg-muted rounded-full mb-2 w-3/5 mx-auto" />
              <div className="h-2.5 bg-muted rounded-full mb-6 w-2/5 mx-auto" />
              <div className="flex items-center justify-center gap-3">
                <Loader
                  size={20}
                  speed={currentSpeed.value}
                  color={currentColor}
                />
                <span className="text-sm text-muted-foreground">
                  Loading profile…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Speed */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
              Speed
            </label>
            <div className="flex gap-2">
              {speeds.map((s, i) => (
                <ControlButton
                  key={s.label}
                  selected={selectedSpeed === i}
                  onClick={() => setSelectedSpeed(i)}
                >
                  {s.label}
                </ControlButton>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
              Size
            </label>
            <div className="flex gap-2">
              {sizes.map((s, i) => (
                <ControlButton
                  key={s.label}
                  selected={selectedSize === i}
                  onClick={() => setSelectedSize(i)}
                >
                  {s.label}
                </ControlButton>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setSelectedColor(i)}
                  title={c.label}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    selectedColor === i
                      ? "scale-110 border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* View */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
              View
            </label>
            <div className="flex gap-2">
              {["Isolated", "In Context"].map((label, i) => (
                <ControlButton
                  key={label}
                  selected={showInContext === (i === 1)}
                  onClick={() => setShowInContext(i === 1)}
                >
                  {label}
                </ControlButton>
              ))}
            </div>
          </div>
        </div>

        {/* CSS Snippet */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              CSS Snippet
            </label>
            <button
              onClick={() => copy(cssSnippet)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="bg-muted border rounded-xl p-5 text-xs leading-relaxed text-muted-foreground overflow-x-auto">
            {cssSnippet}
          </pre>
        </div>
      </main>
    </div>
  );
}
