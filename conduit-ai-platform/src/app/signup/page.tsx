import Nav from "@/components/Nav";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <Nav />
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-cb-gray mb-8">
          Your agents will be running in 10 minutes.
        </p>
        <SignupForm />
      </main>
    </>
  );
}
