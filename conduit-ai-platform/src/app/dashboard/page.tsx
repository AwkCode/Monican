import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: modules } = await supabase
    .from("client_modules")
    .select("*")
    .eq("client_id", user.id);

  const profileComplete = !!(
    client?.full_name &&
    client?.business_name &&
    client?.phone
  );

  const activeModules = (modules ?? []).filter((m) => m.enabled);

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Welcome{client?.full_name ? `, ${client.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-cb-gray mb-10">
          Here&apos;s the state of your Monican workspace.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card
            title="Profile"
            status={profileComplete ? "Complete" : "Incomplete"}
            statusColor={profileComplete ? "green" : "blue"}
            description={
              profileComplete
                ? "Your profile is set. Agents will use this as context."
                : "Finish your profile so your agents sound like you."
            }
            ctaLabel={profileComplete ? "Edit profile" : "Finish profile"}
            ctaHref="/profile"
          />
          <Card
            title="Active modules"
            status={`${activeModules.length} active`}
            statusColor={activeModules.length > 0 ? "green" : "neutral"}
            description={
              activeModules.length > 0
                ? `You have ${activeModules.length} agent(s) running.`
                : "No agents enabled yet. Turn on your first module to get started."
            }
            ctaLabel="Manage modules"
            ctaHref="/modules"
          />
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent activity</h2>
          <div className="border border-cb-border rounded-lg p-6 bg-cb-card text-cb-gray text-sm">
            Activity will appear here once your agents start running.
          </div>
        </section>
      </main>
    </>
  );
}

function Card({
  title,
  status,
  statusColor,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  status: string;
  statusColor: "green" | "blue" | "neutral";
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const colorClass = {
    green: "bg-green-500/20 text-green-300",
    blue: "bg-cb-blue/20 text-blue-300",
    neutral: "bg-cb-card text-cb-gray",
  }[statusColor];

  return (
    <div className="border border-cb-border rounded-lg p-6 bg-cb-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
          {status}
        </span>
      </div>
      <p className="text-cb-gray text-sm mb-5">{description}</p>
      <Link
        href={ctaHref}
        className="inline-block border border-cb-border hover:border-cb-gray px-4 py-2 rounded-md text-sm"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
