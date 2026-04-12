"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CsvUpload() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    rows_imported?: number;
    errors?: string[];
    error?: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setUploading(true);
    setResult(null);

    const text = await file.text();

    const res = await fetch("/api/past-clients/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: text }),
    });

    const data = await res.json();
    setResult(data);
    setUploading(false);

    if (res.ok) {
      router.refresh();
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragging
            ? "border-cb-blue bg-cb-blue/5"
            : "border-cb-border hover:border-cb-gray"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          className="hidden"
        />
        <p className="text-sm text-cb-gray">
          {uploading
            ? "Uploading..."
            : "Drag & drop a CSV here, or click to select"}
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Required column: first_name. Optional: last_name, email, phone,
          property_address, closing_date, birthday, tags, notes
        </p>
      </div>

      {result && (
        <div className="mt-3">
          {result.rows_imported !== undefined && (
            <p className="text-sm text-green-300">
              Imported {result.rows_imported} past clients.
              {(result.errors?.length ?? 0) > 0 &&
                ` (${result.errors!.length} rows skipped)`}
            </p>
          )}
          {result.error && (
            <p className="text-sm text-red-400">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
