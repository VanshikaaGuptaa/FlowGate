import { useEffect, useState } from "react";
import { getApis, createApi } from "../api/apiApi";
import ApiCard from "./ApiCard";

export default function Dashboard({ onLogout, onSelectApi }) {
    const [apis, setApis] = useState([]);
    const [name, setName] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [requestsPerSecond, setRequestsPerSecond] = useState("1");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const targetProxyUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080/proxy"
        : `${window.location.origin}/proxy`;

    const loadApis = async () => {
        try {
            const res = await getApis();
            setApis(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadApis();
    }, []);

    const handleCreate = async () => {
        if (!name || !targetUrl) {
            setError("API Name and Target URL are required.");
            return;
        }

        const rpsVal = parseFloat(requestsPerSecond);
        if (isNaN(rpsVal) || rpsVal <= 0) {
            setError("Requests per second must be a positive number.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Calculate capacity and refillRate
            const calculatedRefillRate = rpsVal;
            const calculatedCapacity = Math.max(1.0, rpsVal);

            await createApi(name, targetUrl, calculatedCapacity, calculatedRefillRate);
            setName("");
            setTargetUrl("");
            setRequestsPerSecond("1");
            loadApis();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create API. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 pb-12">
            <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                FlowGate
                            </span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
                    <p className="text-slate-400 mt-2">Manage your APIs and monitor their usage limits.</p>
                </header>

                <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl mb-12">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Create New API
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">API Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Production Service"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Target URL</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. https://my-backend.com"
                                    value={targetUrl}
                                    onChange={e => setTargetUrl(e.target.value)}
                                />
                                <p className="text-slate-500 text-xs mt-1">The base URL of your backend service</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col justify-center">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Requests per Second (RPS)</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="input-field"
                                    placeholder="e.g. 5, 0.5, 0.001"
                                    value={requestsPerSecond}
                                    onChange={e => setRequestsPerSecond(e.target.value)}
                                />
                                <p className="text-slate-500 text-xs mt-1">
                                    Supports decimal values (e.g. 0.001 for 1 request every 1000 seconds)
                                </p>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <p className="text-red-400 text-sm mt-3">{error}</p>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create API"}
                        </button>
                    </div>
                </section>
                <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl mb-12">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        How to Use Your APIs
                    </h2>

                    <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                        <p>
                            All requests to your backend must be routed through our proxy.
                            We enforce rate limits before forwarding requests to your service.
                            Note: The maximum request limit to our proxy is 50 requests per second. Exceeded requests are rejected immediately.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                <p className="text-slate-400 text-xs mb-1">Proxy Base URL</p>
                                <code className="text-emerald-400 font-mono break-all">
                                    {targetProxyUrl}
                                </code>
                            </div>

                            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                <p className="text-slate-400 text-xs mb-1">Required Header</p>
                                <code className="text-blue-400 font-mono">
                                    X-API-Key: &lt;your-api-key&gt;
                                </code>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-400 text-xs mb-2">Example Payload (JSON Body)</p>
                            <pre className="text-slate-200 text-xs overflow-x-auto font-mono">
{`POST ${targetProxyUrl}
X-API-Key: <your-api-key>
Content-Type: application/json

{
  "path":   "/your-endpoint-path",
  "method": "POST",
  "data":   { "key": "value" }
}`}
                            </pre>
                        </div>

                        <div className="bg-slate-850 rounded-xl p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-slate-800">
                            <h3 className="text-md font-semibold text-indigo-300 flex items-center gap-2 mb-3">
                                💡 Testing with the Built-in Demo App
                            </h3>
                            <p className="text-slate-300 text-xs mb-3">
                                To see FlowGate's queuing and rate-limiting system in action without deploying your own backend, you can test against the demo server running on this instance:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-slate-400 text-xs mb-4">
                                <li>
                                    Create a new API in the section above with any name and set the <strong className="text-slate-200">Target URL</strong> exactly to:
                                    <code className="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded ml-1 font-mono">http://172.17.0.1:9000</code> (Docker) or <code className="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono">http://localhost:9000</code>.
                                </li>
                                <li>
                                    Configure your desired <strong className="text-slate-200">Requests per Second (RPS)</strong>.
                                </li>
                                <li>
                                    Click <strong className="text-slate-200">Create API</strong> and copy your new <strong className="text-indigo-300">API Key</strong>.
                                </li>
                                <li>
                                    Run the following Bash command in your terminal to send a parallel burst of 20 requests:
                                </li>
                            </ol>

                            <div className="bg-slate-900 rounded-lg p-3 border border-slate-700 relative">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Bash / cURL Test Command</p>
                                <pre className="text-slate-200 text-xs overflow-x-auto whitespace-pre font-mono leading-relaxed">
{`for i in {1..20}; do curl -s -X POST "${targetProxyUrl}" -H "X-API-Key: <YOUR_KEY>" -H "Content-Type: application/json" -d '{"path": "/orders", "method": "POST", "data": {"item": "book", "qty": 2}}' -o /dev/null -w "Req $i: status %{http_code}\\n" & done; wait`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                        Active APIs
                    </h2>
                    {apis.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                            <p className="text-slate-400 text-lg">No APIs created yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {apis.map(api => (
                                <ApiCard 
                                    key={api.id} 
                                    api={api} 
                                    onDeleteSuccess={loadApis} 
                                    onClick={() => onSelectApi(api)} 
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
