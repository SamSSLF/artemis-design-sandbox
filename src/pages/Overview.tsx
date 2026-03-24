import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Figma-exported asset URLs (valid ~7 days from generation) ────────────────
// Logomark layers
const LV0  = "https://www.figma.com/api/mcp/asset/644ec348-8490-4e6e-aaae-4175b204cee4";
const LV1  = "https://www.figma.com/api/mcp/asset/6d8adb0a-4254-4047-90d7-0f73ea1e9045";
const LV2  = "https://www.figma.com/api/mcp/asset/4146946a-264c-4660-bb98-be59f543ce90"; // mask
const LV3  = "https://www.figma.com/api/mcp/asset/10c7c3ef-0110-42de-97e5-388267b56a7b";
const LGRP = "https://www.figma.com/api/mcp/asset/bf270586-acd3-4add-ac04-0d0e9806c0e8";
const LV4  = "https://www.figma.com/api/mcp/asset/866044e0-70d0-4808-8cb6-e4439aff3043";
const LV5  = "https://www.figma.com/api/mcp/asset/c212fd26-7175-4a73-8d98-722daacb3fea";
const LUNI = "https://www.figma.com/api/mcp/asset/b3a73223-80f1-4943-a60d-52291af6af90";
const LV6  = "https://www.figma.com/api/mcp/asset/9ec03cdd-2564-4524-94c5-596e700b66c9";
const LV7  = "https://www.figma.com/api/mcp/asset/75ae197b-6bc0-406a-8c01-767939c5e941";
// Content
const CONTRIB_CHART = "https://www.figma.com/api/mcp/asset/afe1089a-91bb-478e-9120-dded7fb510d8";

// ── Icon ─────────────────────────────────────────────────────────────────────
function Icon({
  name,
  style = "regular",
  className,
}: {
  name: string;
  style?: "regular" | "solid";
  className?: string;
}) {
  return <i className={cn(`fa-${style} fa-${name}`, className)} aria-hidden="true" />;
}

// ── Logomark ─────────────────────────────────────────────────────────────────
// Assembled faithfully from Figma layers, including mask + blend mode layers.
function Logomark() {
  return (
    <div className="relative size-8 shrink-0 leading-none">
      {/* Base circle layers */}
      <img alt="" className="absolute inset-0 size-full" src={LV0} />
      <img alt="" className="absolute inset-0 size-full" src={LV1} />

      {/* Inner detail group — offset 3.11px / 3.02px from top-left */}
      <div className="absolute" style={{ left: "3.11px", top: "3.02px" }}>
        {/* Masked composite */}
        <div
          className="relative"
          style={{
            width: "25.928px",
            height: "25.928px",
            maskImage: `url('${LV2}')`,
            WebkitMaskImage: `url('${LV2}')`,
            maskSize: "26.086px 25.928px",
            maskRepeat: "no-repeat",
            maskPosition: "0 0",
          }}
        >
          <img alt="" className="absolute inset-0 size-full" src={LV3} />
          <img alt="" className="absolute inset-0 size-full" src={LGRP} />
          <img alt="" className="absolute inset-0 size-full mix-blend-soft-light" src={LV5} />
          <img alt="" className="absolute inset-0 size-full" src={LUNI} />
        </div>
        {/* Wide sweep element */}
        <img
          alt=""
          className="absolute"
          style={{ left: "9.13px", top: "24.52px" }}
          src={LV4}
        />
        {/* Inner detail at sub-pixel offset */}
        <img
          alt=""
          className="absolute"
          style={{ left: "0.1px", top: "0.1px", width: "25.885px", height: "25.728px" }}
          src={LV6}
        />
      </div>

      {/* Outer ring overlay */}
      <img
        alt=""
        className="absolute"
        style={{ left: "0.2px", top: "0.19px", width: "31.805px", height: "31.806px" }}
        src={LV7}
      />
    </div>
  );
}

// ── App Navbar ────────────────────────────────────────────────────────────────
function AppNavbar() {
  return (
    <header className="bg-background w-full shrink-0">
      {/* Top bar */}
      <div className="flex items-center justify-between pl-8 pr-4 pt-4">
        {/* Left: logo + breadcrumb */}
        <div className="flex items-center gap-4">
          <Logomark />
          <nav className="flex items-center gap-2.5" aria-label="Breadcrumb">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Samantha's Projects
            </Link>
            <Icon name="chevron-right" style="solid" className="text-[8px] text-muted-foreground" />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground">my-repo-name</span>
              <Icon name="angles-up-down" style="solid" className="text-xs text-foreground" />
            </div>
          </nav>
        </div>

        {/* Right: utility buttons */}
        <div className="flex items-center gap-2">
          <button className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
            <Icon name="comment-question" className="text-base text-foreground" />
          </button>

          <div className="h-5 w-px bg-border shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-1">
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
              <Icon name="gear" className="text-base text-foreground" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
              <Icon name="book-open" className="text-base text-foreground" />
            </button>
          </div>

          <div className="h-5 w-px bg-border shrink-0" aria-hidden="true" />

          {/* Wallet balance */}
          <div className="flex items-center gap-1">
            <Icon name="wallet" className="text-base text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">$20.00</span>
            <Icon name="rotate-reverse" style="solid" className="text-xs text-muted-foreground" />
          </div>

          {/* Avatar */}
          <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            <span className="text-sm text-foreground select-none">SF</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-end gap-3 px-8 mt-2 border-b border-border">
        {/* Active tab */}
        <div className="h-8 flex items-center border-b-2 border-primary -mb-px">
          <span className="px-1 py-1 text-sm font-medium text-primary whitespace-nowrap">
            Overview
          </span>
        </div>
        {/* Inactive tab */}
        <button className="h-8 flex items-center -mb-px hover:text-foreground transition-colors">
          <span className="px-1 py-1 text-sm font-medium text-muted-foreground whitespace-nowrap">
            Settings
          </span>
        </button>
      </div>
    </header>
  );
}

// ── Branch Badge ──────────────────────────────────────────────────────────────
function BranchBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border rounded-md shrink-0">
      <Icon name="code-branch" style="solid" className="text-[8px] text-foreground" />
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">{name}</span>
    </span>
  );
}

// ── Activity Item ─────────────────────────────────────────────────────────────
function ActivityItem({
  branch,
  message,
  meta,
  striped,
}: {
  branch: string;
  message: string;
  meta: string;
  striped: boolean;
}) {
  return (
    <div className={cn("flex gap-2.5 items-center px-4 py-3", striped && "bg-muted")}>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <BranchBadge name={branch} />
          <p className="flex-1 text-sm font-medium text-foreground truncate min-w-0">{message}</p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{meta}</p>
      </div>
    </div>
  );
}

// ── Sidebar Menu Card ─────────────────────────────────────────────────────────
interface MenuItem {
  icon: string;
  label: string;
  highlighted: boolean;
}

function SidebarMenuCard({
  title,
  items,
  allLabel,
}: {
  title: string;
  items: MenuItem[];
  allLabel: string;
}) {
  return (
    <div className="border border-border rounded-lg p-2 flex flex-col gap-1 w-[240px] shrink-0">
      <p className="text-sm font-medium text-foreground px-2 py-0.5">{title}</p>
      {items.map((item, i) => (
        <button
          key={i}
          className={cn(
            "w-full flex items-center gap-2 h-8 px-2 rounded-md text-left transition-colors",
            item.highlighted ? "bg-muted" : "hover:bg-muted"
          )}
        >
          <Icon name={item.icon} className="text-sm text-sidebar-foreground shrink-0 w-3.5 text-center" />
          <span className="text-sm text-sidebar-foreground truncate flex-1 min-w-0">{item.label}</span>
        </button>
      ))}
      <button className="w-full flex items-center gap-2 h-8 px-2 rounded-md text-left hover:bg-muted transition-colors">
        <Icon name="ellipsis" className="text-sm text-muted-foreground shrink-0 w-3.5 text-center" />
        <span className="text-sm text-muted-foreground truncate flex-1 min-w-0">{allLabel}</span>
      </button>
    </div>
  );
}

// ── Runner / Commands Table ───────────────────────────────────────────────────
interface RunnerRow {
  name: string;
  online: boolean;
  hardware: string[];
}

function RunnerTable({ title, rows }: { title: string; rows: RunnerRow[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-base font-semibold text-foreground leading-none">{title}</h2>
      <div className="border border-border rounded-lg p-2">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="bg-muted border-b border-border text-left font-medium text-foreground px-2 py-1.5 rounded-tl-md w-[106px]">
                Runner Name
              </th>
              <th className="bg-muted border-b border-border text-left font-medium text-foreground px-2 py-1.5">
                Hardware
              </th>
              <th className="bg-muted border-b border-border rounded-tr-md w-11" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="border-b border-border px-2 py-2 align-top last:border-0">
                  <div className="flex items-start gap-1.5">
                    {/* Status dot */}
                    <Icon
                      name="circle"
                      style="solid"
                      className={cn(
                        "text-2xl leading-none mt-0.5 shrink-0",
                        row.online ? "text-success" : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm font-medium text-foreground leading-5 truncate">{row.name}</span>
                  </div>
                </td>
                <td className="border-b border-border px-2 py-2 align-top">
                  <div className="text-xs text-foreground leading-4 space-y-0">
                    {row.hardware.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </td>
                <td className="border-b border-border px-2 py-2 align-top">
                  <button className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                    <Icon name="check" style="solid" className="text-xs text-primary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Placeholder section ───────────────────────────────────────────────────────
function EmptySection({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-base font-semibold text-foreground leading-none">{label}</h2>
      <div className="border-2 border-dashed border-border rounded-lg py-10 text-center">
        <p className="text-sm text-muted-foreground">{label} will appear here</p>
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const plansItems: MenuItem[] = [
  { icon: "book-open-lines", label: "Deploying a serverless function to Cloudflare Workers", highlighted: true },
  { icon: "book-open-lines", label: "Connecting a database and deploying to Vercel", highlighted: false },
  { icon: "book-open-lines", label: "Setting up CI/CD with GitHub Actions and Docker", highlighted: true },
];

const tasksItems: MenuItem[] = [
  { icon: "square-code", label: "Add a sidebar navigation component", highlighted: true },
  { icon: "square-code", label: "Optimize database queries for improved performance", highlighted: false },
  { icon: "square-code", label: "Set up a CI/CD pipeline with Jenkins and Docker", highlighted: true },
];

const chatsItems: MenuItem[] = [
  { icon: "message", label: "Troubleshooting slow API response times", highlighted: true },
  { icon: "message", label: "Optimizing database queries for faster performance", highlighted: false },
  { icon: "message", label: "Implementing caching strategies for reduced latency", highlighted: true },
];

const runnerRows: RunnerRow[] = [
  {
    name: "mike1",
    online: true,
    hardware: [
      "AMD Ryzen 9 9950X 16-Core Processor (32 vCPUs)",
      "60.48GB RAM",
      "NVIDIA GeForce RTX 4060 (1 GPUs)",
    ],
  },
];

const activityItems = [
  { branch: "develop",  message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #311 opened by artemisfixagent 1 minute ago",        striped: true  },
  { branch: "develop",  message: "fix(ds): allow expand/collapse in Tree when filter is active", meta: "Commit #08d9o3 authored by SamSSLF 1 minute ago",         striped: false },
  { branch: "samfoong", message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #4 opened by artemisfixagent 1 minute ago",           striped: true  },
  { branch: "develop",  message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #4 opened by artemisfixagent 1 minute ago",           striped: false },
  { branch: "samfoong", message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #4 opened by artemisfixagent 1 minute ago",           striped: true  },
  { branch: "develop",  message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #4 opened by artemisfixagent 1 minute ago",           striped: false },
  { branch: "samfoong", message: "chore(feature-flags): remove codeInsights flag",              meta: "PR #4 opened by artemisfixagent 1 minute ago",           striped: true  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Overview() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />

      <div className="flex flex-1 gap-6 px-8 py-6">

        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* Agent activity */}
          <section className="flex flex-col gap-2.5">
            <h2 className="text-base font-semibold text-foreground leading-none">Agent activity</h2>
            <div className="flex gap-2.5">
              <SidebarMenuCard title="Plans"            items={plansItems} allLabel="All Plans"            />
              <SidebarMenuCard title="Standalone Tasks" items={tasksItems} allLabel="All Standalone Tasks" />
              <SidebarMenuCard title="Chats"            items={chatsItems} allLabel="All Chats"            />
            </div>
          </section>

          <EmptySection label="Issues" />
          <EmptySection label="Optimisations" />
        </div>

        {/* ── Right column ────────────────────────────────────────────────── */}
        <div className="w-[460px] shrink-0 flex flex-col gap-6">

          <RunnerTable title="Custom Runner" rows={runnerRows} />
          <RunnerTable title="Commands"      rows={runnerRows} />

          {/* Contribution Activity */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-semibold text-foreground leading-none">Contribution Activity</h2>
            <div className="border border-border rounded-lg overflow-hidden flex flex-col">
              {/* Chart */}
              <div className="p-2">
                <img
                  alt="Contribution activity chart"
                  className="w-full rounded-md object-cover"
                  style={{ aspectRatio: "414 / 147" }}
                  src={CONTRIB_CHART}
                />
              </div>
              {/* Activity feed */}
              <div className="flex flex-col divide-y divide-border">
                {activityItems.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
