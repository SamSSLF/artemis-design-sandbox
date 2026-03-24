import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

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

/* ── Demo Loader (hex color variant for usage examples) ──────────────────── */

function DemoLoader({ size, speed, hex }: { size: number; speed: string; hex: string }) {
  const blockSize = Math.max(8, Math.round(size * 0.32));
  const border = Math.max(1, Math.round(size * 0.04));
  const id = `loader-demo-${size}`.replace(/[\s.]/g, "-");
  const fill = `${hex}4D`;

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

/* ── Typewriter text ─────────────────────────────────────────────────────── */

const typewriterMessages = [
  "Looking for high impact code to target...",
  "This may take a while. Feel free to explore Artemis while I work...",
];

const CHAR_SPEED = 30;
const DISPLAY_DURATION = 3000;
const ERASE_SPEED = 15;

function TypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const phase = useRef<"typing" | "holding" | "erasing">("typing");
  const charIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentMessage = typewriterMessages[messageIndex];

    function tick() {
      if (phase.current === "typing") {
        charIndex.current++;
        setDisplayed(currentMessage.slice(0, charIndex.current));

        if (charIndex.current >= currentMessage.length) {
          phase.current = "holding";
          timerRef.current = setTimeout(tick, DISPLAY_DURATION);
        } else {
          timerRef.current = setTimeout(tick, CHAR_SPEED);
        }
      } else if (phase.current === "holding") {
        phase.current = "erasing";
        timerRef.current = setTimeout(tick, ERASE_SPEED);
      } else if (phase.current === "erasing") {
        charIndex.current--;
        setDisplayed(currentMessage.slice(0, charIndex.current));

        if (charIndex.current <= 0) {
          phase.current = "typing";
          charIndex.current = 0;
          setMessageIndex((prev) => (prev + 1) % typewriterMessages.length);
          return;
        } else {
          timerRef.current = setTimeout(tick, ERASE_SPEED);
        }
      }
    }

    phase.current = "typing";
    charIndex.current = 0;
    setDisplayed("");
    timerRef.current = setTimeout(tick, CHAR_SPEED);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messageIndex]);

  return (
    <div className="h-[40px] flex items-start justify-center">
      <p className="text-sm leading-5 text-muted-foreground text-center max-w-[249px]">
        {displayed}
        <span className="inline-block w-[1px] h-[14px] bg-muted-foreground/50 ml-[1px] animate-pulse align-middle" />
      </p>
    </div>
  );
}

/* ── Syntax-highlighted code block ────────────────────────────────────────── */

const langMap: Record<string, string> = {
  HTML: "markup",
  CSS: "css",
  JS: "javascript",
};

function HighlightedCode({ code, language }: { code: string; language: string }) {
  const prismLang = langMap[language] ?? language;

  return (
    <Highlight theme={themes.github} code={code} language={prismLang}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="p-5 text-xs leading-relaxed overflow-x-auto"
          style={{ ...style, margin: 0 }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

/* ── Tabbed code viewer ──────────────────────────────────────────────────── */

function CodeTabs({ snippets, className = "" }: { snippets: Record<string, string>; className?: string }) {
  const tabs = Object.keys(snippets);
  const [active, setActive] = useState(tabs[0]);

  return (
    <div className={`rounded-xl border overflow-hidden ${className}`}>
      {/* Tab bar */}
      <div className="flex border-b bg-muted/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              active === tab
                ? "bg-background text-foreground border-b-2 border-primary -mb-[1px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <HighlightedCode code={snippets[active]} language={active} />
    </div>
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

  const spinnerSnippets = {
    HTML: `<div class="loader"></div>`,
    CSS: `.loader {
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
}`,
  };

  const usageExampleSnippets = {
    HTML: `<div class="empty-state">
  <div class="loader"></div>
  <p class="status-text"></p>
</div>`,
    CSS: `.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
}

.loader {
  width: 30px;
  aspect-ratio: 1;
  border: 1px solid #64748b4D;
  --c: conic-gradient(
    from -90deg at calc(100% - 1px) calc(100% - 1px),
    transparent 0 90deg, #64748b4D 0
  );
  background: var(--c), var(--c);
  background-size: 10px 10px;
  background-position: 0 0;
  animation: spin 1s infinite;
}

@keyframes spin {
  100% {
    background-position: -10px -10px, 10px 10px;
  }
}

.status-text {
  font-size: 14px;
  line-height: 20px;
  color: #64748b;
  text-align: center;
  max-width: 249px;
}`,
    JS: `const messages = [
  "Looking for high impact code to target...",
  "This may take a while. Feel free to explore Artemis while I work...",
];

const CHAR_SPEED = 30;   // ms per character (typing)
const HOLD_DURATION = 3000; // ms to display full message
const ERASE_SPEED = 15;  // ms per character (erasing)

const el = document.querySelector(".status-text");
let msgIndex = 0;
let charIndex = 0;
let phase = "typing"; // "typing" | "holding" | "erasing"

function tick() {
  const msg = messages[msgIndex];

  if (phase === "typing") {
    charIndex++;
    el.textContent = msg.slice(0, charIndex);
    if (charIndex >= msg.length) {
      phase = "holding";
      setTimeout(tick, HOLD_DURATION);
    } else {
      setTimeout(tick, CHAR_SPEED);
    }
  } else if (phase === "holding") {
    phase = "erasing";
    setTimeout(tick, ERASE_SPEED);
  } else {
    charIndex--;
    el.textContent = msg.slice(0, charIndex);
    if (charIndex <= 0) {
      phase = "typing";
      msgIndex = (msgIndex + 1) % messages.length;
    }
    setTimeout(tick, charIndex <= 0 ? CHAR_SPEED : ERASE_SPEED);
  }
}

tick();`,
  } as const;

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

        {/* Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Code
            </label>
            <button
              onClick={() =>
                copy(
                  Object.entries(spinnerSnippets)
                    .map(([lang, code]) => `/* ${lang} */\n${code}`)
                    .join("\n\n"),
                )
              }
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
          <CodeTabs snippets={spinnerSnippets} />
        </div>

        {/* ── Usage Examples ── */}
        <div className="mt-12">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-4">
            Usage Examples
          </label>

          {/* Empty State */}
          <div className="rounded-xl border bg-card flex items-center justify-center min-h-[280px]">
            <div className="flex flex-col items-center gap-[19px]">
              <DemoLoader size={30} speed="1s" hex="#64748b" />
              <TypewriterText />
            </div>
          </div>

          {/* Tabbed code viewer */}
          <CodeTabs snippets={usageExampleSnippets} className="mt-4" />
        </div>
      </main>
    </div>
  );
}
