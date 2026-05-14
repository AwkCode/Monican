"use client";

export default function GmailConnection({
  connected,
  lastUpdated,
  flashStatus,
  flashReason,
}: {
  connected: boolean;
  lastUpdated: string | null;
  flashStatus: string | null;
  flashReason: string | null;
}) {
  return (
    <div className="border border-mn-border rounded-lg p-6 bg-mn-bg-subtle">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gmail</h2>
        {connected && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
            Connected
          </span>
        )}
      </div>

      {flashStatus === "connected" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-600 mb-4">
          Gmail connected successfully. Your agents can now create drafts in your inbox.
        </div>
      )}

      {flashStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-sm text-red-300 mb-4">
          Gmail connection failed{flashReason ? `: ${flashReason}` : ""}. Please try again.
        </div>
      )}

      {connected ? (
        <div className="space-y-3">
          <p className="text-mn-muted text-sm">
            Your Gmail is connected. Agents will create drafts directly in your inbox
            for you to review before sending.
          </p>
          {lastUpdated && (
            <p className="text-xs text-neutral-500">
              Connected {new Date(lastUpdated).toLocaleDateString()}
            </p>
          )}
          <a
            href="/api/auth/google"
            className="inline-block border border-mn-border hover:border-mn-muted px-4 py-2 rounded-md text-sm"
          >
            Reconnect Gmail
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-mn-muted text-sm">
            Connect your Gmail so your agents can create email drafts in your
            inbox. You always review before anything sends.
          </p>
          <a
            href="/api/auth/google"
            className="inline-block bg-mn-primary hover:bg-mn-primary-hover text-white font-medium px-5 py-2.5 rounded-md text-sm"
          >
            Connect Gmail
          </a>
        </div>
      )}
    </div>
  );
}
