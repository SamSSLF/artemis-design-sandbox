import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";

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

/* ═══════════════════════════════════════════════════════════════════════════
   Minimal GIF89a encoder — zero dependencies, runs entirely in the browser.
   Produces an animated GIF with transparent background.
   ═══════════════════════════════════════════════════════════════════════════ */

function encodeGif(
  frames: ImageData[],
  width: number,
  height: number,
  delayCs: number, // delay in centiseconds (1/100 s)
): Blob {
  const buf: number[] = [];
  const write = (...bytes: number[]) => buf.push(...bytes);
  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) buf.push(s.charCodeAt(i));
  };
  const writeU16 = (v: number) => {
    write(v & 0xff, (v >> 8) & 0xff);
  };

  // — Build a shared 256-color palette via median-cut quantisation ————————
  // Collect unique colors from all frames (with transparent as index 0)
  const colorMap = new Map<number, number>(); // rgb key → palette index
  const palette: number[] = [0, 0, 0]; // index 0 = transparent
  let paletteSize = 1;
  const transparentIdx = 0;

  for (const frame of frames) {
    const d = frame.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue; // transparent pixel
      const key = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
      if (!colorMap.has(key) && paletteSize < 256) {
        colorMap.set(key, paletteSize);
        palette.push(d[i], d[i + 1], d[i + 2]);
        paletteSize++;
      }
    }
  }

  // Pad palette to next power of 2 (min 4)
  let palBits = 2;
  while ((1 << palBits) < paletteSize) palBits++;
  const palLen = 1 << palBits;
  while (palette.length < palLen * 3) palette.push(0);

  // — Header ——————————————————————————————————————————————————————————————
  writeStr("GIF89a");

  // Logical Screen Descriptor
  writeU16(width);
  writeU16(height);
  write(0x80 | ((palBits - 1) & 7)); // GCT flag + color resolution
  write(transparentIdx); // background color index
  write(0); // pixel aspect ratio

  // Global Color Table
  for (let i = 0; i < palLen * 3; i++) write(palette[i]);

  // Netscape looping extension (infinite loop)
  write(0x21, 0xff, 0x0b);
  writeStr("NETSCAPE2.0");
  write(0x03, 0x01);
  writeU16(0); // loop count = 0 (infinite)
  write(0x00);

  // — Frames ——————————————————————————————————————————————————————————————
  for (const frame of frames) {
    // Graphics Control Extension
    write(0x21, 0xf9, 0x04);
    write(0x09); // disposal = restore to bg, transparent flag
    writeU16(delayCs);
    write(transparentIdx);
    write(0x00);

    // Image Descriptor
    write(0x2c);
    writeU16(0); // left
    writeU16(0); // top
    writeU16(width);
    writeU16(height);
    write(0x00); // no local color table

    // — LZW-compress the indexed pixel data ———————————————————————————————
    const minCodeSize = Math.max(2, palBits);
    const pixels = new Uint8Array(width * height);
    const d = frame.data;
    for (let i = 0; i < width * height; i++) {
      const j = i * 4;
      if (d[j + 3] < 128) {
        pixels[i] = transparentIdx;
      } else {
        const key = (d[j] << 16) | (d[j + 1] << 8) | d[j + 2];
        pixels[i] = colorMap.get(key) ?? findClosest(key, palette, palLen);
      }
    }

    const compressed = lzwEncode(pixels, minCodeSize);
    write(minCodeSize);

    // Write sub-blocks (max 255 bytes each)
    let offset = 0;
    while (offset < compressed.length) {
      const chunkSize = Math.min(255, compressed.length - offset);
      write(chunkSize);
      for (let i = 0; i < chunkSize; i++) write(compressed[offset + i]);
      offset += chunkSize;
    }
    write(0x00); // block terminator
  }

  // — Trailer —————————————————————————————————————————————————————————————
  write(0x3b);

  return new Blob([new Uint8Array(buf)], { type: "image/gif" });
}

/** Find closest palette color by Euclidean distance */
function findClosest(key: number, palette: number[], palLen: number): number {
  const r = (key >> 16) & 0xff;
  const g = (key >> 8) & 0xff;
  const b = key & 0xff;
  let best = 1;
  let bestDist = Infinity;
  for (let i = 1; i < palLen; i++) {
    const dr = r - palette[i * 3];
    const dg = g - palette[i * 3 + 1];
    const db = b - palette[i * 3 + 2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/** LZW encoder for GIF */
function lzwEncode(pixels: Uint8Array, minCodeSize: number): number[] {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  // Use a Map for the dictionary: key = "prefix,suffix"
  let dict = new Map<string, number>();
  const initDict = () => {
    dict.clear();
    for (let i = 0; i < clearCode; i++) dict.set(String(i), i);
    codeSize = minCodeSize + 1;
    nextCode = eoiCode + 1;
  };

  const output: number[] = [];
  let bitBuf = 0;
  let bitCount = 0;

  const writeCode = (code: number) => {
    bitBuf |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      output.push(bitBuf & 0xff);
      bitBuf >>= 8;
      bitCount -= 8;
    }
  };

  initDict();
  writeCode(clearCode);

  if (pixels.length === 0) {
    writeCode(eoiCode);
    if (bitCount > 0) output.push(bitBuf & 0xff);
    return output;
  }

  let prefix = String(pixels[0]);
  for (let i = 1; i < pixels.length; i++) {
    const suffix = pixels[i];
    const key = prefix + "," + suffix;
    if (dict.has(key)) {
      prefix = key;
    } else {
      writeCode(dict.get(prefix)!);
      if (nextCode < 4096) {
        dict.set(key, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
      } else {
        writeCode(clearCode);
        initDict();
      }
      prefix = String(suffix);
    }
  }

  writeCode(dict.get(prefix)!);
  writeCode(eoiCode);
  if (bitCount > 0) output.push(bitBuf & 0xff);

  return output;
}

/* ── Render frames to canvas ──────────────────────────────────────────────── */

function renderSpinnerFrames(
  size: number,
  speedMs: number,
  hexColor: string,
  frameCount: number,
): ImageData[] {
  const blockSize = Math.max(8, Math.round(size * 0.32));
  const border = Math.max(1, Math.round(size * 0.04));

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const fillColor = `rgba(${r},${g},${b},0.3)`;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const frames: ImageData[] = [];

  for (let f = 0; f < frameCount; f++) {
    const progress = f / frameCount;

    // Clear to transparent
    ctx.clearRect(0, 0, size, size);

    // Border
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = border;
    ctx.strokeRect(border / 2, border / 2, size - border, size - border);

    // Two conic-gradient layers, each a tiled pattern of bottom-right triangles
    const offsets = [
      { x: -blockSize * progress, y: -blockSize * progress },
      { x: blockSize * progress, y: blockSize * progress },
    ];

    for (const { x: ox, y: oy } of offsets) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(border, border, size - border * 2, size - border * 2);
      ctx.clip();
      ctx.fillStyle = fillColor;

      for (let tx = ox - blockSize * 2; tx < size + blockSize; tx += blockSize) {
        for (let ty = oy - blockSize * 2; ty < size + blockSize; ty += blockSize) {
          ctx.beginPath();
          ctx.moveTo(tx + blockSize, ty);
          ctx.lineTo(tx + blockSize, ty + blockSize);
          ctx.lineTo(tx, ty + blockSize);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    }

    frames.push(ctx.getImageData(0, 0, size, size));
  }

  return frames;
}

/* ── GIF export hook ──────────────────────────────────────────────────────── */

function useGifExport() {
  const [exporting, setExporting] = useState(false);

  const exportGif = useCallback(
    (size: number, speedMs: number, hexColor: string) => {
      setExporting(true);

      // Use requestAnimationFrame to let the UI update before heavy work
      requestAnimationFrame(() => {
        try {
          const frameCount = 20;
          const delayCs = Math.round(speedMs / frameCount / 10); // centiseconds
          const frames = renderSpinnerFrames(size, speedMs, hexColor, frameCount);
          const blob = encodeGif(frames, size, size, delayCs);

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "loading-spinner.gif";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
          console.error("GIF export failed:", err);
        }
        setExporting(false);
      });
    },
    [],
  );

  return { exporting, exportGif };
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
  const { exporting, exportGif } = useGifExport();

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

        {/* Export GIF */}
        <button
          onClick={() =>
            exportGif(currentSize.value, currentSpeed.ms, currentColor.hex)
          }
          disabled={exporting}
          className="w-full mb-8 flex items-center justify-center gap-2 py-3 rounded-lg border border-primary bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          <Download size={16} />
          {exporting ? "Generating GIF…" : "Export as GIF"}
        </button>

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
