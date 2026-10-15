// Le tableau de bord du gérant : /admin (ce mois-ci) ou /admin?periode=tout
// Protégé : getDashboard() et getAdminOrders() appellent requireAdmin() avant de lire quoi que ce soit.
import Link from "next/link";
import { Suspense } from "react";
import { OrderList } from "@/components/admin/OrderList";
import { formatFcfa } from "@/lib/money";
import { type Period, getDashboard } from "@/server/admin/dashboard";
import { getAdminOrders } from "@/server/admin/orders";
import { requireAdmin } from "@/server/auth";

export default function DashboardPage(props: PageProps<"/admin">) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const admin = await requireAdmin();
  const period: Period = (await searchParams).periode === "tout" ? "tout" : "mois";
  const [stats, toProcess] = await Promise.all([getDashboard(period), getAdminOrders("a-traiter", 5)]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm tracking-widest text-or-fonce">TABLEAU DE BORD</p>
          <h1 className="mt-2 font-display text-3xl text-bleu sm:text-4xl">Bonjour, {admin.name}.</h1>
        </div>
        <PeriodSwitch period={period} />
      </div>

      {/* Les trois chiffres essentiels : encaissé, coûté, gagné. */}
      <section aria-label="Résultats" className="mt-8 grid gap-px bg-encre/10 sm:grid-cols-3">
        <Stat label="Chiffre d'affaires" value={formatFcfa(stats.revenue)} detail={`${stats.paidOrders} commande${stats.paidOrders > 1 ? "s" : ""} payée${stats.paidOrders > 1 ? "s" : ""} · ${stats.pieces} pièce${stats.pieces > 1 ? "s" : ""}`} />
        <Stat label="Coût (tissu + couture)" value={formatFcfa(stats.cost)} detail="au prix du jour de la commande" />
        <Stat
          label="Bénéfice brut"
          value={formatFcfa(stats.profit)}
          detail={stats.revenue > 0 ? `${stats.margin} % du chiffre d'affaires` : "—"}
          highlight
        />
      </section>

      <section aria-label="À suivre" className="mt-px grid gap-px bg-encre/10 sm:grid-cols-2">
        <Stat
          label="À encaisser"
          value={formatFcfa(stats.toCollect)}
          detail={`${stats.unpaidOrders} commande${stats.unpaidOrders > 1 ? "s" : ""} en attente de paiement`}
          href="/admin/commandes?filtre=a-payer"
        />
        <Stat
          label="À traiter à l'atelier"
          value={String(stats.toProcess)}
          detail="commandes payées, pas encore livrées"
          href="/admin/commandes?filtre=a-traiter"
        />
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-sm tracking-widest text-gris">À TRAITER</h2>
          <Link href="/admin/commandes" className="text-sm text-bleu underline-offset-4 hover:underline">
            Toutes les commandes →
          </Link>
        </div>
        <OrderList orders={toProcess} empty="Aucune commande payée en attente. L'atelier est à jour." />
      </section>
    </>
  );
}

function PeriodSwitch({ period }: { period: Period }) {
  const options = [
    { value: "mois", label: "Ce mois-ci", href: "/admin" },
    { value: "tout", label: "Depuis le début", href: "/admin?periode=tout" },
  ] as const;
  return (
    <nav aria-label="Période" className="flex border border-encre/15 bg-white text-sm">
      {options.map((option) => (
        <Link
          key={option.value}
          href={option.href}
          aria-current={period === option.value ? "page" : undefined}
          className={`inline-flex min-h-10 items-center px-4 transition-colors ${
            period === option.value ? "bg-bleu text-white" : "text-gris hover:text-encre"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}

function Stat({
  label,
  value,
  detail,
  highlight = false,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-sm text-gris">{label}</p>
      <p className={`mt-2 text-2xl font-medium tabular-nums sm:text-3xl ${highlight ? "text-or-fonce" : "text-encre"}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-gris">{detail}</p>
    </>
  );
  const className = "block bg-white p-5 sm:p-6";
  return href ? (
    <Link href={href} className={`${className} transition-colors hover:bg-ivoire/60`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true">
      <div className="h-16 w-64 bg-encre/5" />
      <div className="mt-8 h-32 bg-encre/5" />
      <div className="mt-px h-32 bg-encre/5" />
    </div>
  );
}
