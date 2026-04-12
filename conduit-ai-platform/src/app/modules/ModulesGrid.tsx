"use client";

import Link from "next/link";

type Module = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  phase: string;
  href: string;
  ready: boolean;
};

export default function ModulesGrid({
  catalog,
  enabledMap,
}: {
  catalog: Module[];
  enabledMap: Record<string, boolean>;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {catalog.map((m) => {
        const isOn = !!enabledMap[m.key];
        return (
          <div
            key={m.key}
            className="border border-cb-border rounded-lg p-6 bg-cb-card flex flex-col"
          >
            <p className="text-xs uppercase tracking-wide text-cb-blue mb-2">
              {m.tagline}
            </p>
            <h3 className="text-xl font-semibold mb-2">{m.name}</h3>
            <p className="text-cb-gray text-sm leading-relaxed mb-4 flex-1">
              {m.description}
            </p>
            {isOn && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 font-medium w-fit mb-4">
                Active
              </span>
            )}
            {m.ready ? (
              <Link
                href={m.href}
                className="w-full py-2.5 rounded-md font-medium text-sm text-center bg-cb-blue hover:bg-cb-blue-hover text-white"
              >
                {isOn ? "Manage" : "Set up"}
              </Link>
            ) : (
              <span className="w-full py-2.5 rounded-md font-medium text-sm text-center bg-cb-border text-cb-gray border border-cb-border cursor-not-allowed">
                {m.phase}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
