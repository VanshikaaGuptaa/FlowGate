export default function ApiCard({ api }) {

  const statusStyles = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    RATE_LIMITED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    INACTIVE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusStyle =
    statusStyles[api.status] ??
    "bg-slate-500/20 text-slate-400 border-slate-500/30";

  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">
          {api.name}
        </h3>

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
        <p><b>Capacity:</b> {api.capacity}</p>
        <p><b>Refill:</b> {api.refillRate}/sec</p>
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
          POST /proxy  +  {'{"path": "/your-endpoint"}'}
        </code>
      </div>
    </div>
  );
}
