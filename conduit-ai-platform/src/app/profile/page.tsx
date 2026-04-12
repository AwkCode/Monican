import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
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

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Your profile
        </h1>
        <p className="text-cb-gray mb-8">
          This is the context your agents use. The more you fill in, the more
          they sound like you.
        </p>
        <ProfileForm
          initial={{
            id: user.id,
            email: user.email ?? "",
            full_name: client?.full_name ?? "",
            phone: client?.phone ?? "",
            business_name: client?.business_name ?? "",
            business_address: client?.business_address ?? "",
            role: client?.role ?? "",
            towns_served: (client?.towns_served ?? []).join(", "),
            school_district: client?.school_district ?? "",
            years_in_business: client?.years_in_business ?? null,
            voice_sample: client?.voice_sample ?? "",
            signature_block: client?.signature_block ?? "",
          }}
        />
      </main>
    </>
  );
}
