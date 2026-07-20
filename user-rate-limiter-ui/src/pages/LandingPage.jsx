import { useState, useEffect, useRef } from "react";

// ── SVG Icons ────────────────────────────────────────────────────────
const ZapIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const CpuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M12 3v1.5M15.75 3v1.5M8.25 19.5V21M12 19.5V21M15.75 19.5V21M3 8.25h1.5M3 12h1.5M3 15.75h1.5M19.5 8.25H21M19.5 12H21M19.5 15.75H21m-15.75-6a2.25 2.25 0 00-2.25 2.25v5.25a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25V9.75A2.25 2.25 0 0013.5 7.5h-5.25z" />
  </svg>
);

const ServerIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a3 3 0 013-3m0 0a3 3 0 013-3h10.5a3 3 0 013 3M3 11.25V18m18-6.75V18" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const LayersIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m11.142 0L21.75 12l-4.179-2.25M6.429 9.75l5.571 3 5.571-3m-11.142 0L12 7.5l5.571 2.25m-11.142 4.5L12 16.5l5.571-2.25" />
  </svg>
);

const RefreshIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export default function LandingPage({ onGetStarted }) {
  // ── Simulator States ────────────────────────────────────────────────
  const [tokens, setTokens] = useState(8);
  const [queue, setQueue] = useState([]);
  const [logs, setLogs] = useState([
    { id: 1, time: "22:04:01", type: "system", msg: "FlowGate rate limiter initialized." },
    { id: 2, time: "22:04:02", type: "system", msg: "Redis connection active. Token Bucket set to 10 capacity." }
  ]);
  const [reqCounter, setReqCounter] = useState(1);
  const [backendActive, setBackendActive] = useState(false);
  const [stats, setStats] = useState({ accepted: 0, dropped: 0, processed: 0 });

  // ── Code Snippet Switcher States ────────────────────────────────────
  const [codeLang, setCodeLang] = useState("curl");
  const [codeCopied, setCodeCopied] = useState(false);

  const codeSnippets = {
    curl: `# Point traffic to FlowGate Ingress Gateway (Port 8080)
curl -X POST http://localhost:8080/api/v1/orders \\
  -H "X-FlowGate-Key: fg_live_99a8b7c6d5" \\
  -H "Content-Type: application/json" \\
  -d '{"item_id": "item_992", "quantity": 1}'`,

    nodejs: `import fetch from 'node-fetch';

// Wrap API calls through FlowGate Edge Proxy
const response = await fetch('http://localhost:8080/api/v1/orders', {
  method: 'POST',
  headers: {
    'X-FlowGate-Key': process.env.FLOWGATE_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ item_id: 'item_992', quantity: 1 })
});

const data = await response.json(); // Instantly returns 202 Accepted or 200 OK`,

    python: `import requests

# Dispatch request to FlowGate Ingress
url = "http://localhost:8080/api/v1/orders"
headers = {
    "X-FlowGate-Key": "fg_live_99a8b7c6d5",
    "Content-Type": "application/json"
}
payload = {"item_id": "item_992", "quantity": 1}

response = requests.post(url, json=payload, headers=headers)
print(f"Status: {response.status_code}, Response: {response.json()}")`,

    go: `package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
	jsonPayload := []byte(\`{"item_id": "item_992", "quantity": 1}\`)
	req, _ := http.NewRequest("POST", "http://localhost:8080/api/v1/orders", bytes.NewBuffer(jsonPayload))
	req.Header.Set("X-FlowGate-Key", "fg_live_99a8b7c6d5")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	fmt.Println("Response Status:", resp.Status)
}`,

    java: `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:8080/api/v1/orders"))
    .header("X-FlowGate-Key", "fg_live_99a8b7c6d5")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\"item_id\":\"item_992\"}"))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println("FlowGate Status: " + response.statusCode());`
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippets[codeLang]);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const capacity = 10;
  const refillRate = 2;
  const logsContainerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prev) => {
        const next = Math.min(capacity, prev + (refillRate * 0.1));
        return parseFloat(next.toFixed(2));
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (queue.length > 0) {
        setTokens((prevTokens) => {
          if (prevTokens >= 1) {
            const req = queue[0];
            setQueue((prevQ) => prevQ.slice(1));
            setStats((s) => ({ ...s, processed: s.processed + 1 }));
            setBackendActive(true);
            setTimeout(() => setBackendActive(false), 250);

            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            setLogs((prevLogs) => [
              ...prevLogs,
              {
                id: Math.random(),
                time: timeStr,
                type: "success",
                msg: `Worker -> Forwarded Req #${req.id} (${req.path}) to backend. Status: 200 OK`
              }
            ]);

            return prevTokens - 1;
          }
          return prevTokens;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [queue]);

  const addRequest = (path = "/orders") => {
    const id = reqCounter;
    setReqCounter((c) => c + 1);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];

    if (queue.length >= 12) {
      setStats((s) => ({ ...s, dropped: s.dropped + 1 }));
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          id: Math.random(),
          time: timeStr,
          type: "error",
          msg: `Gateway -> Client request rejected. Error: 503 Global Rate Limit Exceeded`
        }
      ]);
      return;
    }

    setQueue((prevQ) => [...prevQ, { id, path }]);
    setStats((s) => ({ ...s, accepted: s.accepted + 1 }));
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        id: Math.random(),
        time: timeStr,
        type: "incoming",
        msg: `POST /proxy -> Key validated. Status: 202 Accepted. Queued Req #${id}`
      }
    ]);
  };

  const sendBurst = () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        addRequest(i % 2 === 0 ? "/orders" : "/users");
      }, i * 80);
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Canvas particle background (keeps secondary rose/pink shades)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 65;
    const connectionDistance = 110;

    const mouse = { x: null, y: null };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.45)" : "rgba(244, 114, 182, 0.4)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-emerald-500/30 relative overflow-hidden bg-transparent">
      
      {/* Interactive Network Particle Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── Custom CSS Animations ────────────────────────────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .text-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #34D399 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .border-glow-emerald {
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.25);
        }
        .glow-emerald-active {
          box-shadow: 0 0 25px rgba(52, 211, 153, 0.45);
        }
        .glow-green-active {
          box-shadow: 0 0 25px rgba(52, 211, 153, 0.5);
        }
        @keyframes dash-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-dash-flow {
          stroke-dasharray: 6 6;
          animation: dash-flow 1s linear infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-950/20 blur-[140px] pointer-events-none animate-pulse-glow z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-950/20 blur-[140px] pointer-events-none animate-pulse-glow z-0" style={{ animationDelay: "2s" }} />

      <div className="relative z-10">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/90 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-2 rounded-xl text-black shadow-lg shadow-black/50">
              <ZapIcon className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
              FlowGate
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#features" onClick={(e) => handleNavClick(e, "features")} className="hover:text-white transition-colors">Features</a>
            <a href="#simulator" onClick={(e) => handleNavClick(e, "simulator")} className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className="hover:text-white transition-colors">Architecture</a>
            <a href="#stats" onClick={(e) => handleNavClick(e, "stats")} className="hover:text-white transition-colors">Why FlowGate</a>
          </nav>

          {/* Primary button -> White */}
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-sm transition-all hover:scale-[1.03] shadow-lg shadow-black/40 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative pt-[140px] pb-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-xs font-semibold text-white">
            <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
            <span>FlowGate Gateway is Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Protect Your Backends From <br />
            <span className="text-gradient">Sudden Traffic Spikes</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
            FlowGate acts as a smart gatekeeper for your API. Instead of rejecting users with immediate rate limits during peaks, it queues incoming requests in RabbitMQ and streams them to your server at a safe, controlled rate.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
            {/* Primary button -> White */}
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-black/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Let's Get Started</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            
            <a
              href="#simulator"
              onClick={(e) => handleNavClick(e, "simulator")}
              className="flex items-center justify-center bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-colors"
            >
              Try the Simulator
            </a>
          </div>

          {/* Quick Fact Badges */}
          <div className="grid grid-cols-3 gap-6 pt-8 w-full border-t border-zinc-900 max-w-2xl">
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">0%</h4>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">Dropped Requests</p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">&lt;1ms</h4>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">Gateway Overhead</p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">100%</h4>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">Backend Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HERO APP WINDOW SHOWCASE ──────────────────────────────────────── */}
      <section className="px-6 max-w-7xl mx-auto pb-20">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-3 sm:p-5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Window Header */}
          <div className="bg-black/80 border border-zinc-800/80 rounded-2xl px-4 py-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-400 hidden sm:inline-block bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                https://flowgate.internal/dashboard/live-telemetry
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM OPERATIONAL
              </span>
              <span className="text-zinc-400 hidden md:inline-block">Latency: <strong className="text-white">0.38ms</strong></span>
            </div>
          </div>

          {/* Window Body: Real Dashboard Mockup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Sidebar Mockup */}
            <div className="hidden lg:block lg:col-span-3 bg-black/60 border border-zinc-800/80 rounded-2xl p-4 space-y-4">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">GATEWAY NODES</div>
              <div className="space-y-1 text-xs font-medium">
                <div className="bg-zinc-900 text-white p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">⚡ Ingress: 8080</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-zinc-400 p-2.5 rounded-xl hover:bg-zinc-900/50 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">⚙️ Redis Lua Engine</span>
                  <span className="text-[10px] text-emerald-400">ACTIVE</span>
                </div>
                <div className="text-zinc-400 p-2.5 rounded-xl hover:bg-zinc-900/50 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">📦 RabbitMQ Buffer</span>
                  <span className="text-[10px] text-amber-400 font-mono">0 queued</span>
                </div>
                <div className="text-zinc-400 p-2.5 rounded-xl hover:bg-zinc-900/50 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono">🖥️ Backend: 9000</span>
                  <span className="text-[10px] text-zinc-500">LISTEN</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">PROTECTION SPECS</div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-[11px] space-y-1.5 font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Algorithm:</span>
                    <span className="text-white font-bold">Token Bucket</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Global RPS Limit:</span>
                    <span className="text-emerald-400 font-bold">50 RPS</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Buffer Queue:</span>
                    <span className="text-amber-400 font-bold">RabbitMQ AMQP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Panel */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* Stat Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-black/70 border border-zinc-800 p-4 rounded-2xl space-y-1">
                  <span className="text-zinc-400 text-xs font-mono">INGRESS THROUGHPUT</span>
                  <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-between">
                    <span>1,420 <span className="text-xs font-normal text-zinc-500">req/min</span></span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">+12%</span>
                  </div>
                </div>
                <div className="bg-black/70 border border-zinc-800 p-4 rounded-2xl space-y-1">
                  <span className="text-zinc-400 text-xs font-mono">BUFFER QUEUE DEPTH</span>
                  <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-between">
                    <span>0 <span className="text-xs font-normal text-zinc-500">requests</span></span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">0 Dropped</span>
                  </div>
                </div>
                <div className="bg-black/70 border border-zinc-800 p-4 rounded-2xl space-y-1">
                  <span className="text-zinc-400 text-xs font-mono">LUA EVAL LATENCY</span>
                  <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-between">
                    <span>0.38 <span className="text-xs font-normal text-zinc-500">ms</span></span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">Optimal</span>
                  </div>
                </div>
              </div>

              {/* Endpoint Protection Rules Table */}
              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-3">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span>🛡️ Active Endpoint Rate Limiting Rules</span>
                  </span>
                  <span className="text-emerald-400 font-bold bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                    Live Enforcement Active
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* Route 1: Heavy AI endpoint */}
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">POST</span>
                      <span className="text-white font-bold">/api/v1/llm/generate</span>
                      <span className="text-zinc-500 text-[11px] hidden sm:inline">(Heavy AI Generation)</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-zinc-400">Limit: <strong className="text-white">5 req/min</strong></span>
                      <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">Strict Token Refill</span>
                    </div>
                  </div>

                  {/* Route 2: Checkout endpoint */}
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px]">POST</span>
                      <span className="text-white font-bold">/api/v1/orders/checkout</span>
                      <span className="text-zinc-500 text-[11px] hidden sm:inline">(Transactional)</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-zinc-400">Limit: <strong className="text-white">20 req/min</strong></span>
                      <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">RabbitMQ Queued</span>
                    </div>
                  </div>

                  {/* Route 3: Standard read endpoint */}
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-bold text-[10px]">GET</span>
                      <span className="text-white font-bold">/api/v1/health</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-zinc-400">Limit: <strong className="text-white">500 req/min</strong></span>
                      <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Pass-Through</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── MULTI-LANGUAGE CODE INTEGRATION TABS ───────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-zinc-900 text-center space-y-8">
        <div className="space-y-3">
          <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Drop-In Integration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Protect Any API Endpoint in Under 3 Minutes
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Zero infrastructure rebuilds required. Simply pass your request headers or point traffic through FlowGate’s edge proxy.
          </p>
        </div>

        {/* Code Switcher Block */}
        <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-left">
          
          {/* Tabs Bar */}
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {[
                { id: "curl", name: "cURL" },
                { id: "nodejs", name: "Node.js" },
                { id: "python", name: "Python" },
                { id: "go", name: "Go" },
                { id: "java", name: "Java / Spring" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCodeLang(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    codeLang === tab.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{codeCopied ? "✓ Copied!" : "Copy Code"}</span>
            </button>
          </div>

          {/* Code Window */}
          <div className="p-6 overflow-x-auto bg-zinc-950/90 font-mono text-xs sm:text-sm text-emerald-300/90 leading-relaxed selection:bg-emerald-500/30">
            <pre className="whitespace-pre">
              <code>{codeSnippets[codeLang]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURE SHOWCASE ───────────────────────────────────────── */}
      <section id="features" className="scroll-mt-[100px] py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Architectural Excellence
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Sub-Millisecond Speed
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            FlowGate replaces bloated API proxies with an in-memory Redis Lua engine, asynchronous RabbitMQ queuing, and live WebSocket telemetry.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Card 1 (Large - 7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
            
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3 rounded-2xl text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                  <CpuIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ATOMIC LUA EVALUATOR
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                Sub-Millisecond Redis Lua Refills
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Rate limits are evaluated in-memory using atomic Redis Lua scripts. Prevents race conditions during heavy parallel spikes without database locks.
              </p>
            </div>

            {/* Interactive Animated Visual Widget */}
            <div className="bg-black/90 border border-zinc-800/80 rounded-2xl p-5 relative z-10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  EVALUATION_LATENCY
                </span>
                <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  0.38ms avg
                </span>
              </div>

              {/* Animated Progress Token Refill */}
              <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800 relative">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 animate-pulse" style={{ width: "85%" }} />
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500">
                <span>EVAL_STATUS: 200_OK</span>
                <span>TOKENS_REFILLED: +2/sec</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2 (Small - 5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-purple-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-500" />
            
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-3 rounded-2xl text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <LayersIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  RABBITMQ QUEUE
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                Zero Request Loss Buffer
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Surge traffic is safely queued in RabbitMQ and answered with <code className="text-purple-300 font-mono">202 Accepted</code> instantly.
              </p>
            </div>

            {/* Visual Stack Widget */}
            <div className="bg-black/90 border border-zinc-800/80 rounded-2xl p-4 relative z-10 space-y-2">
              <div className="flex justify-between items-center text-xs text-zinc-400 font-mono mb-2">
                <span>RABBITMQ_BUFFER_STACK</span>
                <span className="text-purple-300 font-bold">0 Dropped</span>
              </div>
              <div className="space-y-1.5">
                <div className="bg-purple-950/30 border border-purple-500/40 p-2 rounded-lg text-xs font-mono text-purple-200 flex justify-between items-center animate-pulse">
                  <span>Req #1092 ➔ Queued</span>
                  <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded font-bold">202 ACCEPTED</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-xs font-mono text-zinc-400 flex justify-between items-center">
                  <span>Req #1091 ➔ Forwarded</span>
                  <span className="text-[10px] text-zinc-500">200 OK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3 (Small - 5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3 rounded-2xl text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  PROTECTION SHIELD
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                Global RPS Hard Ceiling
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Configurable per-API limits and a global 50 RPS hard cap protect your backend infrastructure from runaway abuse.
              </p>
            </div>

            {/* Visual Shield Status Widget */}
            <div className="bg-black/90 border border-zinc-800/80 rounded-2xl p-4 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="text-xs font-bold text-white font-mono">GATEWAY_SHIELD_ACTIVE</div>
                  <div className="text-[11px] text-zinc-500">Max Ceiling: 50 RPS</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                PROTECTED
              </span>
            </div>
          </div>

          {/* Bento Card 4 (Large - 7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-500" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-2xl text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <ChartBarIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  WEBSOCKET TELEMETRY
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                Sub-Second Telemetry Analytics
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Stream real-time throughput metrics, queue depths, and token bucket replenishment live to your dashboard over WebSockets.
              </p>
            </div>

            {/* Animated Live Chart Widget */}
            <div className="bg-black/90 border border-zinc-800/80 rounded-2xl p-4 relative z-10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE_METRICS_FEED
                </span>
                <span className="text-zinc-400">1,420 Req/Min</span>
              </div>

              {/* Mini SVG Animated Line Chart */}
              <div className="h-16 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 60">
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    points="0,45 40,30 80,50 120,20 160,35 200,10 240,40 280,15 320,25 360,5 400,20"
                  />
                  <circle cx="400" cy="20" r="4" fill="#38bdf8" className="animate-ping" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── INTERACTIVE SIMULATOR ─────────────────────────────────────────── */}
      <section id="simulator" className="scroll-mt-[100px] py-20 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 bg-zinc-900 text-white border border-zinc-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Live Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Interact With FlowGate in Real-Time</h2>
          <p className="text-zinc-400">
            Click to send requests below. Watch how the token bucket empties and refills while RabbitMQ queues overflow safely, feeding the backend at a steady rate.
          </p>
        </div>

        {/* Sandbox Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Control Console (col 5) */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                Traffic Generator
              </h3>
              <p className="text-xs text-zinc-400">
                Simulate client requests hitting your endpoints. Send one request at a time, or spam with a burst of 8 requests to overflow the rate limiter.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => addRequest("/orders")}
                  className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-white hover:text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                >
                  <span>POST /orders</span>
                </button>
                <button
                  onClick={() => addRequest("/users")}
                  className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-white hover:text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                >
                  <span>POST /users</span>
                </button>
              </div>

              {/* Primary Burst Button -> White */}
              <button
                onClick={sendBurst}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-black/40 active:scale-[0.98] cursor-pointer"
              >
                Spam Burst (8 Requests)
              </button>
            </div>

            {/* Simulated Live Metrics */}
            <div className="bg-black rounded-xl p-4 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gateway Telemetry</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-xl font-extrabold text-white">{stats.accepted}</div>
                  <div className="text-[10px] text-zinc-500">202 Accepted</div>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-xl font-extrabold text-emerald-400">{stats.processed}</div>
                  <div className="text-[10px] text-zinc-500">Processed</div>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-xl font-extrabold text-amber-400">{stats.dropped}</div>
                  <div className="text-[10px] text-zinc-500">503 Blocked</div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-1.5 text-xs text-white hover:underline font-bold"
              >
                <span>Get API Keys to Configure Custom Limits</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Simulation Display (col 7) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            
            {/* Visualizer Row */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Visual Pipeline</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${queue.length > 5 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : queue.length > 0 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-zinc-900 text-zinc-500"}`}>
                  {queue.length > 5 ? "RATE_LIMITED" : queue.length > 0 ? "ACTIVE" : "IDLE"}
                </span>
              </div>

              {/* Graphical Pipeline Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                
                {/* 1. Token Bucket */}
                <div className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col items-center gap-3">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">Token Bucket</span>
                  
                  <div className="w-full flex flex-col gap-1.5 bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                      <span>Tokens:</span>
                      <span className="font-bold text-white">{Math.floor(tokens)} / {capacity}</span>
                    </div>

                    <div className="w-full h-2.5 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 transition-all duration-100"
                        style={{ width: `${(tokens / capacity) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 mt-1">
                      {Array.from({ length: capacity }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2.5 rounded-sm transition-all duration-300 ${
                            i < Math.floor(tokens)
                              ? "bg-white shadow-sm shadow-white/40"
                              : "bg-black border border-zinc-900"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500">Refill: +{refillRate}/sec</span>
                </div>

                {/* 2. RabbitMQ Buffer Queue */}
                <div className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col items-center gap-3 relative">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">RabbitMQ Queue</span>

                  <div className="w-full min-h-[96px] bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex flex-col justify-center items-center gap-2 overflow-hidden">
                    {queue.length === 0 ? (
                      <span className="text-zinc-600 text-xs italic">Queue Empty</span>
                    ) : (
                      <div className="w-full flex flex-wrap gap-1.5 justify-center">
                        {queue.map((req, idx) => (
                          <div
                            key={req.id}
                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                              idx === 0
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                                : "bg-black text-zinc-400 border-zinc-800"
                            }`}
                          >
                            Req #{req.id}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">Buffer Size: {queue.length}</span>
                </div>

                {/* 3. Protected Backend */}
                <div className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${backendActive ? "bg-emerald-950/30 border-emerald-400/50 glow-green-active" : "bg-black border-zinc-800"}`}>
                  <span className={`text-[11px] font-bold uppercase transition-colors duration-300 ${backendActive ? "text-emerald-400" : "text-zinc-500"}`}>Backend Server</span>

                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${backendActive ? "bg-emerald-500/20 text-emerald-400 scale-105" : "bg-zinc-950 text-zinc-600"}`}>
                    <ServerIcon className="w-8 h-8" />
                  </div>

                  <span className={`text-[10px] font-semibold transition-colors duration-300 ${backendActive ? "text-emerald-400" : "text-zinc-500"}`}>
                    {backendActive ? "Processing API Call" : "Listening :9000"}
                  </span>
                </div>

              </div>
            </div>

            {/* Shell Terminal Console log */}
            <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden text-left flex flex-col h-48">
              <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] font-bold text-emerald-400 font-mono">FLOWGATE_LOGS_STREAM</span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              <div ref={logsContainerRef} className="p-4 overflow-y-auto font-mono text-xs space-y-1.5 flex-1 select-text">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-zinc-600 text-[10px] select-none">[{log.time}]</span>
                    <span className={`
                      ${log.type === "error" ? "text-rose-400" : ""}
                      ${log.type === "success" ? "text-emerald-400 font-medium" : ""}
                      ${log.type === "incoming" ? "text-white font-medium" : ""}
                      ${log.type === "system" ? "text-emerald-500/80" : ""}
                    `}>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── ANIMATED SVG ARCHITECTURE FLOW ──────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-[100px] py-24 bg-zinc-950/60 border-t border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto text-center">
          
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              Under The Hood
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Interactive Traffic Pipeline
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Watch how incoming requests are authenticated, buffered in RabbitMQ, and dispatched without dropping a single packet.
            </p>
          </div>

          {/* Interactive SVG Flow Canvas Board */}
          <div className="bg-black border border-zinc-800 rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-emerald-500/5 w-96 h-96 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 bg-amber-500/5 w-96 h-96 blur-3xl rounded-full pointer-events-none" />

            {/* SVG Animated Connection Line (Visible on Medium+ screens) */}
            <div className="hidden md:block relative w-full h-12 my-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 40">
                {/* Background Line */}
                <path d="M 50 20 L 750 20" stroke="#27272a" strokeWidth="3" fill="none" />
                {/* Animated Dash Stroke Line */}
                <path d="M 50 20 L 750 20" stroke="#34d399" strokeWidth="3" strokeDasharray="8 8" className="animate-dash-flow" fill="none" />
                {/* Pulsing Signal Particles */}
                <circle cx="250" cy="20" r="5" fill="#ffffff" className="animate-ping" />
                <circle cx="500" cy="20" r="5" fill="#fbbf24" className="animate-ping" style={{ animationDelay: "0.5s" }} />
                <circle cx="700" cy="20" r="5" fill="#34d399" className="animate-ping" style={{ animationDelay: "1s" }} />
              </svg>
            </div>

            {/* 4 Pipeline Node Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch relative z-10">
              
              {/* Node 1 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-left space-y-3 hover:border-emerald-500/40 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-emerald-300">STEP 01</span>
                  <span className="text-[10px] bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">HTTPS POST</span>
                </div>
                <h4 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">Client Request</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  Client dispatches requests with target endpoint path and key headers to port <code className="text-white font-mono bg-zinc-900 px-1 rounded">8080</code>.
                </p>
              </div>

              {/* Node 2 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-left space-y-3 hover:border-amber-500/40 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-amber-300">STEP 02</span>
                  <span className="text-[10px] bg-amber-950/40 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">REDIS LUA</span>
                </div>
                <h4 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">Atomic Rate Check</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  FlowGate executes Redis Lua scripts to verify global 50 RPS limits and authenticates API keys in-memory.
                </p>
              </div>

              {/* Node 3 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-left space-y-3 hover:border-purple-500/40 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-purple-300">STEP 03</span>
                  <span className="text-[10px] bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">AMQP QUEUE</span>
                </div>
                <h4 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">Instant 202 Buffer</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  Publishes payload to RabbitMQ and instantly returns <code className="text-purple-300 font-mono bg-zinc-900 px-1 rounded">202 Accepted</code> to prevent client timeout.
                </p>
              </div>

              {/* Node 4 */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-left space-y-3 hover:border-emerald-500/40 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-emerald-300">STEP 04</span>
                  <span className="text-[10px] bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">HTTP PROXY</span>
                </div>
                <h4 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">Controlled Dispatch</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed">
                  Background worker polls RabbitMQ at steady token-bucket intervals, delivering clean requests to port <code className="text-emerald-300 font-mono bg-zinc-900 px-1 rounded">9000</code>.
                </p>
              </div>

            </div>

            {/* Protocol Status Bar */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>PIPELINE_STATUS: 100% OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
                <span>Ingress: 8080</span>
                <span>•</span>
                <span>Redis Port: 6379</span>
                <span>•</span>
                <span>RabbitMQ: 5672</span>
                <span>•</span>
                <span>Backend Port: 9000</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE VALUES & STATS ────────────────────────────────────────────── */}
      <section id="stats" className="scroll-mt-[100px] py-16 bg-black border-t border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">FlowGate Philosophy</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Why Queued Gatekeeping Beats Standard Drop-Rate-Limiting</h3>
            <p className="text-zinc-400">
              Traditional API gateways return <code className="text-rose-300 bg-zinc-900 px-1.5 py-0.5 rounded">429 Too Many Requests</code> immediately when limits are hit, breaking user flows. FlowGate uses an intelligent buffer queue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-4 text-left hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/10">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">No Backend Overloads</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                By setting a hard limit on request forwarding rate (Token Bucket), backend processes never exceed their database connection limits. Say goodbye to spike-induced crashes.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-4 text-left hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-500/10">
                <LayersIcon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">RabbitMQ Asynchronous Buffer</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Requests are answered immediately with a <code className="text-white bg-black px-1 py-0.5 rounded border border-zinc-800">202 Accepted</code>. Under the hood, RabbitMQ stores requests securely, preserving every transaction.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-4 text-left hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/10">
                <RefreshIcon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Zero State Friction</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Automatic cache sweepers clean up Redis state on startup, preventing old keys and stale tokens from corrupting your live statistics or limit tallies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 via-black to-emerald-950/20 border border-zinc-800 rounded-3xl p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Shield Your Infrastructure Today</h2>
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Stop losing service continuity to unexpected load. Provision API keys, configure rate limiting policies, and monitor system performance in real-time.
          </p>

          <div className="pt-4">
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-zinc-200 text-black font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-black/50 hover:scale-[1.02] cursor-pointer"
            >
              Let's Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-black px-6 py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 text-white">
              <ZapIcon className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-zinc-300">FlowGate</span>
          </div>

          <p>© {new Date().getFullYear()} FlowGate. All rights reserved. Built for secure and robust API gatekeeping.</p>
        </div>
      </footer>

      </div>
    </div>
  );
}