import Nav from "@/components/Nav";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <Nav />
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-cb-gray mb-8">
          Log in to your Monican dashboard.
        </p>
        <LoginForm />
      </main>
    </>
  );
}
