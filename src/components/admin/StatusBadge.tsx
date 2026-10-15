// Une petite pastille de statut : « Payé » en vert, « En attente » en ambre…
import type { Tone } from "@/lib/order-display";

const tones: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-700/20",
  red: "bg-red-50 text-red-800 ring-red-700/20",
  blue: "bg-bleu/[0.06] text-bleu ring-bleu/20",
  grey: "bg-encre/[0.04] text-gris ring-encre/15",
};

export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}
