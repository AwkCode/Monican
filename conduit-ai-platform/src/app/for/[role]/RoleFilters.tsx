"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RoleFilters({
  roleSlug,
  categories,
  currentCategory,
  currentSort,
}: {
  roleSlug: string;
  categories: string[];
  currentCategory?: string;
  currentSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`/for/${roleSlug}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <Chip
          active={!currentCategory}
          onClick={() => setParam("category", null)}
        >
          All
        </Chip>
        {categories.map((cat) => (
          <Chip
            key={cat}
            active={currentCategory === cat}
            onClick={() => setParam("category", cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-mn-muted">Sort by</span>
        <select
          value={currentSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="bg-white border border-mn-border rounded-lg px-3 py-1.5 text-mn-text focus:outline-none focus:border-mn-primary"
        >
          <option value="rating">Top rated</option>
          <option value="hours">Most hours saved</option>
          <option value="money">Most $ saved</option>
        </select>
      </div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
        active
          ? "bg-mn-text text-white"
          : "bg-white border border-mn-border text-mn-text hover:border-mn-muted"
      }`}
    >
      {children}
    </button>
  );
}
