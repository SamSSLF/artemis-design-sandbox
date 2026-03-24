import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Layout } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPE REGISTRY
// Add an entry here for each prototype you create.
// ─────────────────────────────────────────────────────────────────────────────
interface Prototype {
  title: string;
  description: string;
  path: string;
  status: "in-progress" | "ready" | "archived";
}

const prototypes: Prototype[] = [
  {
    title: "Build Tab — Overview",
    description: "Project dashboard: agent activity (plans, tasks, chats), custom runners, contribution feed.",
    path: "/overview",
    status: "in-progress",
  },
  {
    title: "Loading Spinner",
    description: "Geometric conic-gradient spinner with configurable speed, size, and color.",
    path: "/loading-spinner",
    status: "ready",
  },
];

const statusColors: Record<Prototype["status"], string> = {
  "in-progress": "bg-amber-100 text-amber-800 border-amber-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Layout size={18} />
            <span className="text-sm font-medium uppercase tracking-widest">
              Design Sandbox
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Prototype Navigator
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            A scratchpad for UX flows and component experiments. Add new
            prototypes in <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">src/pages/</code> and
            register them in <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">Index.tsx</code>.
          </p>
        </div>

        <Separator className="mb-10" />

        {/* Prototype list */}
        {prototypes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {prototypes.map((proto) => (
              <Link key={proto.path} to={proto.path} className="group block">
                <Card className="transition-all duration-150 hover:shadow-md hover:border-primary/30 group-hover:bg-accent/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {proto.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {proto.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[proto.status]}`}
                        >
                          {proto.status}
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Token preview strip */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Brand Token Preview
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Primary", cls: "bg-primary text-primary-foreground" },
              { label: "Secondary", cls: "bg-secondary text-secondary-foreground border" },
              { label: "Accent", cls: "bg-accent text-accent-foreground" },
              { label: "Muted", cls: "bg-muted text-muted-foreground" },
              { label: "Destructive", cls: "bg-destructive text-destructive-foreground" },
            ].map(({ label, cls }) => (
              <span
                key={label}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${cls}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-border p-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Layout size={22} className="text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        No prototypes yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        Copy <code className="font-mono">src/pages/_template.tsx</code> to start
        a new prototype, then register it in <code className="font-mono">Index.tsx</code>.
      </p>
    </div>
  );
}
