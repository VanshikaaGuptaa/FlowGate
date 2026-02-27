import { useEffect, useState } from "react";
import { getApis, createApi } from "../api/apiApi";
import ApiCard from "./ApiCard";

export default function Dashboard({ onLogout }) {
    const [apis, setApis] = useState([]);
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(10);
    const [refillRate, setRefillRate] = useState(1);
    const [loading, setLoading] = useState(false);

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
        if (!name) return;
        setLoading(true);
        await createApi(name, capacity, refillRate);
        setName("");
        setLoading(false);
        loadApis();
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
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Max Requests"
                                    value={capacity}
                                    onChange={e => setCapacity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Refill Rate</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Tokens per second"
                                    value={refillRate}
                                    onChange={e => setRefillRate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
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
                        </p>

                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-400 text-xs mb-1">Proxy Base URL</p>
                            <code className="text-emerald-400">
                                http://localhost:8080/proxy
                            </code>
                        </div>

                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-400 text-xs mb-1">Required Header</p>
                            <code className="text-blue-400">
                                X-API-Key: {"<your-api-key>"}
                            </code>
                        </div>

                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-400 text-xs mb-2">Example</p>
                            <pre className="text-slate-200 text-xs overflow-x-auto">
                                {`POST http://localhost:8080/proxy
X-API-Key: <your-api-key>
Content-Type: application/json

{
  "path":   "/orders",
  "method": "POST",
  "data":   { "item": "book", "qty": 1 }
}`}
                            </pre>
                        </div>

                        <p className="text-slate-400 text-sm">
                            Send any endpoint as <code className="text-slate-200">"path"</code> in
                            the JSON body. FlowGate will forward it to your backend.
                        </p>
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
                                <ApiCard key={api.id} api={api} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
