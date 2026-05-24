import { useEffect, useState, useRef } from "react";

export default function MetricsPage({ api, onBack }) {
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    incoming: 0,
    outgoing: 0,
    queueDepth: 0,
    tokens: api.capacity || 10,
    capacity: api.capacity || 10,
    refillRate: api.refillRate || 1,
  });
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const wsRef = useRef(null);
  const [scriptTab, setScriptTab] = useState("powershell");

  const targetProxyUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/proxy"
    : `${window.location.origin}/proxy`;

  // Initialize flat history for 30 data points to give a smooth rolling start
  useEffect(() => {
    const initialCapacity = api.capacity || 10;
    const initialRefill = api.refillRate || 1;
    const dummyPoints = Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (30 - i) * 1000,
      incoming: 0,
      outgoing: 0,
      queueDepth: 0,
      tokens: initialCapacity,
      capacity: initialCapacity,
      refillRate: initialRefill,
    }));
    setMetricsHistory(dummyPoints);
  }, [api]);

  // Connect to WebSocket
  useEffect(() => {
    let wsBaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    // If VITE_API_URL is relative (e.g. starts with "/" or does not contain "://")
    if (wsBaseURL.startsWith("/") || !wsBaseURL.includes("://")) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host; // resolves e.g., flowgate.website or localhost:3000
      const basePath = wsBaseURL.startsWith("/") ? wsBaseURL : `/${wsBaseURL}`;
      wsBaseURL = `${protocol}//${host}${basePath}`;
    } else {
      wsBaseURL = wsBaseURL.replace(/^http/, "ws");
    }

    const wsURL = `${wsBaseURL}/ws/metrics/${api.apiKey}`;

    console.log("Connecting to WebSocket:", wsURL);
    const ws = new WebSocket(wsURL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("Connected");
      console.log("WebSocket connected.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCurrentMetrics(data);

        setMetricsHistory((prev) => {
          // Slide the window
          const next = [...prev.slice(1), data];
          return next;
        });
      } catch (err) {
        console.error("Error parsing WebSocket metrics:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setConnectionStatus("Connection Error");
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
      console.log("WebSocket disconnected.");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [api.apiKey]);

  // Helper to render beautiful SVG paths with gradient fills
  const renderSvgChart = (dataKey, strokeColor, fillColor, minVal = 0, defaultMax = 10) => {
    const width = 800;
    const height = 180;
    const padding = 10;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const values = metricsHistory.map((d) => d[dataKey] ?? 0);
    const maxVal = Math.max(defaultMax, ...values, 1.0); // dynamic auto-scaling

    // Convert data points to (x, y) coordinates
    const coords = metricsHistory.map((d, index) => {
      const x = padding + (index / (metricsHistory.length - 1)) * graphWidth;
      const val = d[dataKey] ?? 0;
      // Invert Y axis for SVG rendering
      const y = padding + graphHeight - (val / maxVal) * graphHeight;
      return { x, y };
    });

    // Build the line path
    let linePath = "";
    if (coords.length > 0) {
      linePath = `M ${coords[0].x} ${coords[0].y} ` + 
        coords.slice(1).map((c) => `L ${c.x} ${c.y}`).join(" ");
    }

    // Build the closed path for background gradient fill
    let fillPath = "";
    if (coords.length > 0) {
      fillPath = `${linePath} L ${coords[coords.length - 1].x} ${padding + graphHeight} L ${coords[0].x} ${padding + graphHeight} Z`;
    }

    // Grid lines count
    const gridRows = 4;
    const gridCols = 6;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          {/* Definitions for gorgeous gradients and filters */}
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id={`glow-${dataKey}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: gridRows + 1 }).map((_, i) => {
            const y = padding + (i / gridRows) * graphHeight;
            return (
              <line
                key={`grid-y-${i}`}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            );
          })}
          {Array.from({ length: gridCols + 1 }).map((_, i) => {
            const x = padding + (i / gridCols) * graphWidth;
            return (
              <line
                key={`grid-x-${i}`}
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            );
          })}

          {/* Background area gradient fill */}
          {fillPath && (
            <path d={fillPath} fill={`url(#grad-${dataKey})`} />
          )}

          {/* Glowing Stroke line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${dataKey})`}
            />
          )}

          {/* Latest data point dot */}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="6"
              fill={strokeColor}
              stroke="#0f172a"
              strokeWidth="2"
              className="animate-ping"
              style={{ transformOrigin: `${coords[coords.length - 1].x}px ${coords[coords.length - 1].y}px` }}
            />
          )}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}
        </svg>
        {/* Dynamic Y-Axis scale label overlay */}
        <div className="absolute top-1 left-2 text-[10px] text-slate-500 font-medium">
          Max: {maxVal.toFixed(0)}
        </div>
        <div className="absolute bottom-1 left-2 text-[10px] text-slate-500 font-medium">
          0
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
      {/* Header Nav */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition duration-200 text-sm font-semibold border border-slate-700"
            >
              ← Back to Dashboard
            </button>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              FlowGate Live metrics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === "Connected" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
              }`}
            ></span>
            <span className="text-xs font-semibold text-slate-300">{connectionStatus}</span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: The Live Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Pipeline</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {api.name}
                </h1>
                <p className="text-slate-400 text-sm mt-1 truncate max-w-lg">
                  Target: <span className="text-slate-300 font-medium">{api.targetUrl || "http://localhost:9000"}</span>
                </p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3 border border-slate-700 text-xs font-mono space-y-1 w-full sm:w-auto">
                <p className="text-slate-400">API Key: <span className="text-indigo-300 break-all select-all">{api.apiKey}</span></p>
                <p className="text-slate-400">Proxy Target: <span className="text-emerald-400">POST /proxy</span></p>
              </div>
            </div>
          </div>

          {/* Visual flow explanation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Traffic Flow Mechanics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 text-center">
              <div className="bg-blue-950/40 border border-blue-900/50 rounded-xl p-3">
                <div className="text-blue-400 text-lg font-bold">{currentMetrics.incoming} req/s</div>
                <div className="text-xs text-slate-400">1. Burst Traffic In</div>
              </div>
              <div className="text-slate-600 hidden md:block">➔</div>
              <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-3">
                <div className="text-amber-400 text-lg font-bold">{currentMetrics.queueDepth} queued</div>
                <div className="text-xs text-slate-400">2. Queue Absorbs</div>
              </div>
              <div className="text-slate-600 hidden md:block">➔</div>
              <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3">
                <div className="text-emerald-400 text-lg font-bold">{currentMetrics.outgoing} req/s</div>
                <div className="text-xs text-slate-400">3. Smooth Outflow</div>
              </div>
            </div>
          </div>

          {/* Graph 1: Incoming Traffic */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></span>
                  Graph 1 — Incoming Requests/sec
                </h3>
                <p className="text-xs text-slate-400 mt-1">Measures all burst traffic entering FlowGate in real-time</p>
              </div>
              <span className="text-2xl font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                {currentMetrics.incoming} <span className="text-xs font-semibold text-slate-400">req/s</span>
              </span>
            </div>
            {renderSvgChart("incoming", "#60a5fa", "#3b82f6", 0, 10)}
          </div>

          {/* Graph 2: Outgoing Traffic */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
                  Graph 2 — Outgoing Requests/sec
                </h3>
                <p className="text-xs text-slate-400 mt-1">Measures controlled traffic successfully leaving FlowGate after token refill approval</p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                {currentMetrics.outgoing} <span className="text-xs font-semibold text-slate-400">req/s</span>
              </span>
            </div>
            {renderSvgChart("outgoing", "#34d399", "#10b981", 0, Math.max(10, currentMetrics.capacity))}
          </div>

          {/* Graph 3: Queue Depth */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></span>
                  Graph 3 — Queue Size Over Time
                </h3>
                <p className="text-xs text-slate-400 mt-1">Measures the backlog size held in RabbitMQ, proving FlowGate absorbs the burst</p>
              </div>
              <span className="text-2xl font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                {currentMetrics.queueDepth} <span className="text-xs font-semibold text-slate-400">items</span>
              </span>
            </div>
            {renderSvgChart("queueDepth", "#f59e0b", "#d97706", 0, 20)}
          </div>
        </div>

        {/* Right 1 Col: Live Stats Widgets & Action Panel */}
        <div className="space-y-6">
          
          {/* Metrics Widget: Queue Depth */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queue Backlog</span>
              <h4 className="text-slate-500 text-xs mt-1">Current Queue Depth</h4>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-amber-400 tracking-tight">
                {currentMetrics.queueDepth}
              </span>
              <span className="text-slate-400 text-sm font-semibold">messages waiting</span>
            </div>
            {currentMetrics.queueDepth > 0 ? (
              <div className="mt-4 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-pulse">
                ⚠ FlowGate Queue is actively absorbing burst traffic!
              </div>
            ) : (
              <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
                ✓ Queue is currently empty. Downstream is fully caught up.
              </div>
            )}
          </div>

          {/* Metrics Widget: Token Bucket Meter */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Bucket</span>
              <h4 className="text-slate-500 text-xs mt-1">Available Tokens</h4>
            </div>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-emerald-400 tracking-tight">
                {currentMetrics.tokens.toFixed(1)}
              </span>
              <span className="text-slate-500 text-2xl font-bold">/</span>
              <span className="text-slate-400 text-lg font-bold">
                {currentMetrics.capacity}
              </span>
            </div>

            {/* Visual Bucket Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span>Refilling at {currentMetrics.refillRate}/sec</span>
                <span>{((currentMetrics.tokens / currentMetrics.capacity) * 100).toFixed(0)}% full</span>
              </div>
              <div className="w-full bg-slate-850 rounded-full h-3.5 p-0.5 border border-slate-700 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (currentMetrics.tokens / currentMetrics.capacity) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Test Action Panel */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <h3 className="text-md font-bold text-white mb-2">⚡ Visual Proof Load Test</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To trigger the **visual proof** in real-time, copy the load test script below and run it in your terminal. 
              This will send 20 requests rapidly to simulate a burst!
            </p>

            {/* Script Selector Tabs */}
            <div className="flex border-b border-slate-800 mb-4 text-xs">
              <button
                onClick={() => setScriptTab("powershell")}
                className={`pb-2 px-3 font-semibold transition-all relative ${
                  scriptTab === "powershell"
                    ? "text-indigo-400 font-bold border-b-2 border-indigo-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                PowerShell (Windows)
              </button>
              <button
                onClick={() => setScriptTab("bash")}
                className={`pb-2 px-3 font-semibold transition-all relative ${
                  scriptTab === "bash"
                    ? "text-indigo-400 font-bold border-b-2 border-indigo-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Bash / cURL (Mac/Linux/Git Bash)
              </button>
            </div>

            <div className="bg-slate-950 rounded-lg p-3 border border-slate-850 relative">
              <pre className="text-[11px] text-indigo-300 overflow-x-auto whitespace-pre font-mono leading-tight max-h-56">
                {scriptTab === "powershell" ? (
`1..20 | ForEach-Object {
  $id = $_
  try {
    $body = @{ 
      path = "/orders"
      method = "POST"
      data = @{ item = "book"; qty = 2 } 
    } | ConvertTo-Json
    $resp = Invoke-RestMethod \`
      -Uri "${targetProxyUrl}" \`
      -Method Post \`
      -Headers @{"X-API-Key"="${api.apiKey}"} \`
      -Body $body \`
      -ContentType "application/json"
    Write-Host "Request \${id}: Queued - \${resp}" -ForegroundColor Green
  } catch {
    Write-Host "Request \${id}: Failed" -ForegroundColor Yellow
  }
}`
                ) : (
`for i in {1..20}; do curl -s -X POST "${targetProxyUrl}" -H "X-API-Key: ${api.apiKey}" -H "Content-Type: application/json" -d '{"path": "/orders", "method": "POST", "data": {"item": "book", "qty": 2}}' -o /dev/null -w "Req $i: status %{http_code}\\n" & done; wait`
                )}
              </pre>
            </div>

            <button
              onClick={() => {
                const scriptText = scriptTab === "powershell" ? (
`1..20 | ForEach-Object {
  $id = $_
  try {
    $body = @{ 
      path = "/orders"
      method = "POST"
      data = @{ item = "book"; qty = 2 } 
    } | ConvertTo-Json
    $resp = Invoke-RestMethod \`
      -Uri "${targetProxyUrl}" \`
      -Method Post \`
      -Headers @{"X-API-Key"="${api.apiKey}"} \`
      -Body $body \`
      -ContentType "application/json"
    Write-Host "Request \${id}: Queued - \${resp}" -ForegroundColor Green
  } catch {
    Write-Host "Request \${id}: Failed" -ForegroundColor Yellow
  }
}`
                ) : (
`for i in {1..20}; do curl -s -X POST "${targetProxyUrl}" -H "X-API-Key: ${api.apiKey}" -H "Content-Type: application/json" -d '{"path": "/orders", "method": "POST", "data": {"item": "book", "qty": 2}}' -o /dev/null -w "Req $i: status %{http_code}\\n" & done; wait`
                );
                navigator.clipboard.writeText(scriptText);
                alert(`${scriptTab === "powershell" ? "PowerShell" : "Bash/cURL"} script copied to clipboard!`);
              }}
              className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition duration-200"
            >
              Copy Load Test Script
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
