"use client";

import { useState } from "react";

export default function DraftLetterButton({
  signalId,
  drafted,
}: {
  signalId: string;
  drafted: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch(`/api/signals/${signalId}/draft-letter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ save_as_draft: false }),
    });
    const data = await res.json();
    if (res.ok) {
      setLetter(data.letter);
      setSubject(data.subject);
      setShowModal(true);
    }
    setLoading(false);
  }

  async function saveToGmail() {
    setSaving(true);
    const res = await fetch(`/api/signals/${signalId}/draft-letter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ save_as_draft: true }),
    });
    if (res.ok) {
      setSaved(true);
    }
    setSaving(false);
  }

  return (
    <>
      <button
        onClick={generate}
        disabled={loading}
        className={`text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-50 ${
          drafted
            ? "border border-mn-primary/40 text-mn-primary hover:bg-mn-primary/10"
            : "bg-mn-primary hover:bg-mn-primary-hover text-white"
        }`}
      >
        {loading
          ? "Generating..."
          : drafted
            ? "Regenerate letter"
            : "Draft letter"}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-mn-bg-subtle border border-mn-border rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-mn-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">Draft outreach letter</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-mn-muted hover:text-mn-text text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {subject && (
                <div>
                  <label className="text-xs text-mn-muted uppercase tracking-wide">
                    Subject
                  </label>
                  <p className="text-sm text-mn-text mt-1">{subject}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-mn-muted uppercase tracking-wide">
                  Letter
                </label>
                <textarea
                  value={letter ?? ""}
                  onChange={(e) => setLetter(e.target.value)}
                  rows={12}
                  className="w-full mt-1 bg-mn-bg border border-mn-border rounded-md px-3 py-2 text-sm text-mn-text font-mono focus:outline-none focus:border-mn-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-mn-border flex gap-3">
              <button
                onClick={saveToGmail}
                disabled={saving || saved}
                className="bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-4 py-2 rounded-md text-sm disabled:opacity-50"
              >
                {saved
                  ? "Saved to Gmail drafts"
                  : saving
                    ? "Saving..."
                    : "Save as Gmail draft"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(letter ?? "");
                }}
                className="border border-mn-border hover:border-mn-muted px-4 py-2 rounded-md text-sm"
              >
                Copy to clipboard
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-mn-muted hover:text-mn-text px-4 py-2 text-sm ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
