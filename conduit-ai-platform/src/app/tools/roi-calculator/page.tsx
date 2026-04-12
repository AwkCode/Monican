import Nav from "@/components/Nav";
import Calculator from "./Calculator";

export const metadata = {
  title: "ROI Calculator — Conduit AI",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Workflow ROI Calculator
        </h1>
        <p className="text-cb-gray mb-8">
          Add the workflows you want to automate. We&apos;ll calculate exactly
          how much time and money you&apos;ll save.
        </p>
        <Calculator />
      </main>
    </>
  );
}
