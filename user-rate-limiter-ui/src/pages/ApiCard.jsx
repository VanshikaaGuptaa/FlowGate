import { useState } from "react";
import { deleteApi } from "../api/apiApi";

export default function ApiCard({ api, onDeleteSuccess, onClick }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete the API "${api.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteApi(api.id);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete API.");
      setDeleting(false);
    }
  };

  const statusStyles = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    RATE_LIMITED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    INACTIVE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusStyle =
    statusStyles[api.status] ??
    "bg-slate-500/20 text-slate-400 border-slate-500/30";

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl cursor-pointer hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-350 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {api.name}
            </h3>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
              📊 View Live Metrics ➔
            </span>
          </div>

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle}`}
          >
            {api.status.replace("_", " ")}
          </span>
        </div>

      {/* Optional rate-limited hint */}
      {api.status === "RATE_LIMITED" && (
        <p className="text-xs text-amber-400 mb-3">
          Requests are currently being throttled
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm text-slate-300">
        <p><b>Refill:</b> {api.refillRate}/sec</p>
        {api.targetUrl && (
          <p className="truncate"><b>Target:</b> <span className="text-slate-400">{api.targetUrl}</span></p>
        )}
      </div>

      {/* API Key */}
      <div className="mt-4 bg-slate-900 rounded-lg p-3 border border-slate-700">
        <p className="text-slate-400 text-xs mb-1">API Key</p>
        <code className="text-blue-400 text-xs break-all">
          {api.apiKey}
        </code>
      </div>

      {/* Usage */}
      <div className="mt-3 bg-slate-900 rounded-lg p-3 border border-slate-700">
        <p className="text-slate-400 text-xs mb-1">Usage</p>
        <code className="text-emerald-400 text-xs">
          POST /proxy
        </code>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-3 text-right">{error}</p>
      )}

      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/30 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete API"}
        </button>
      </div>
    </div>
  );
}
