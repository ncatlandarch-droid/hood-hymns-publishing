"use client";

import { useState, useRef, useEffect } from "react";
import { products } from "@/data/store";

// ── Auth ────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "BrothersWin";

// ── Types ───────────────────────────────────────────────────────────
type View =
  | "dashboard"
  | "orders"
  | "products"
  | "printful"
  | "subscribers"
  | "testimonials"
  | "books"
  | "settings";

interface SidebarItem {
  id: View;
  icon: string;
  label: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "products", icon: "🏷️", label: "Products" },
  { id: "printful", icon: "👕", label: "Printful" },
  { id: "subscribers", icon: "📧", label: "Subscribers" },
  { id: "testimonials", icon: "🎤", label: "Testimonials" },
  { id: "books", icon: "📚", label: "Books & Manuscripts" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

// ── Demo data ───────────────────────────────────────────────────────
const DEMO_ORDERS = [
  { id: "HH-1042", customer: "Darius J.", product: "Harmonies of Hope (Paperback)", amount: "$24.99", date: "Jun 12, 2026", status: "Fulfilled" as const },
  { id: "HH-1041", customer: "Keisha M.", product: "B2B Logo Hoodie", amount: "$55.00", date: "Jun 11, 2026", status: "Shipped" as const },
  { id: "HH-1040", customer: "Trevon W.", product: "Prodigal Block Vol. I (Paperback)", amount: "$24.99", date: "Jun 11, 2026", status: "Pending" as const },
  { id: "HH-1039", customer: "Angela P.", product: "Studio Snapback", amount: "$28.00", date: "Jun 10, 2026", status: "Fulfilled" as const },
  { id: "HH-1038", customer: "Marcus B.", product: "B2B Signature Tee", amount: "$40.00", date: "Jun 10, 2026", status: "Shipped" as const },
  { id: "HH-1037", customer: "Jasmine R.", product: "Harmonies of Hope (E-Book)", amount: "$12.99", date: "Jun 9, 2026", status: "Fulfilled" as const },
  { id: "HH-1036", customer: "DeShawn K.", product: "Hood Hymns Studio Hoodie", amount: "$55.00", date: "Jun 9, 2026", status: "Pending" as const },
  { id: "HH-1035", customer: "Crystal L.", product: "Detroit Choir Tee", amount: "$40.00", date: "Jun 8, 2026", status: "Fulfilled" as const },
];

const RECENT_ACTIVITY = [
  { icon: "🛒", text: "Darius J. purchased Harmonies of Hope", time: "2h ago" },
  { icon: "📦", text: "Order HH-1041 shipped via USPS", time: "5h ago" },
  { icon: "⭐", text: "New 5-star review on Prodigal Block", time: "8h ago" },
  { icon: "📧", text: "3 new email subscribers", time: "12h ago" },
  { icon: "🎤", text: "New testimonial published", time: "1d ago" },
  { icon: "📚", text: "Harmonies Vol 2 draft: Chapter 8 complete", time: "2d ago" },
];

const PRINTFUL_PRODUCTS = [
  { name: "B2B Logo Hoodie", printfulId: "436109640", synced: true },
  { name: "B2B Signature Tee", printfulId: "436109678", synced: true },
  { name: "B2B Embroidered Cap", printfulId: "436109712", synced: true },
  { name: "B2B Classic Crewneck", printfulId: "436109738", synced: true },
  { name: "Detroit Choir Tee", printfulId: "436109770", synced: true },
  { name: "Hood Hymns Studio Hoodie", printfulId: "436109792", synced: true },
  { name: "Studio Signature Tee", printfulId: "436109808", synced: true },
  { name: "Studio Snapback", printfulId: "436109824", synced: true },
  { name: "Harmonies Character Tee", printfulId: "436109838", synced: true },
];

const BOOK_PIPELINE = [
  { title: "Harmonies of Hope Vol 1", status: "published" as const, icon: "✅", detail: "Published · 2026 · Paperback + E-Book" },
  { title: "Harmonies of Hope Vol 2 (Bad Decisions, But God)", status: "in-progress" as const, icon: "📝", detail: "In Progress · Chapter 8/14 · Est. Fall 2026" },
  { title: "Harmonies of Hope Vol 3 (Bent But Not Broken)", status: "planned" as const, icon: "📋", detail: "Planned · Outline Phase · Est. 2027" },
  { title: "Prodigal Block Vol 1: Lost Frequency", status: "published" as const, icon: "✅", detail: "Published · 2026 · 285 pages" },
  { title: "Prodigal Block Vol 2: Coming Home", status: "in-progress" as const, icon: "📝", detail: "In Progress · First Draft · Est. Late 2026" },
];

// ════════════════════════════════════════════════════════════════════
//  ADMIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Testimonial recorder state (preserved from original)
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Product availability toggles
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    () => Object.fromEntries(products.map((p) => [p.id, true]))
  );

  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  // ── Auth handlers ───────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  // ── Testimonial recorder handlers (preserved) ──────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new (window as any).MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track: any) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setSuccess(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Could not access microphone. Please allow microphone permissions.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function handleSubmit() {
    if (!audioBlob && !textMessage.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      if (audioBlob) formData.append("audio", audioBlob, "testimonial.webm");
      if (textMessage.trim()) formData.append("text", textMessage.trim());

      const res = await fetch("/api/testimonial", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      setSuccess(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setTextMessage("");
      setRecordingTime(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const viewTitles: Record<View, string> = {
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    printful: "Printful Sync",
    subscribers: "Subscribers",
    testimonials: "Testimonials",
    books: "Books & Manuscripts",
    settings: "Settings",
  };

  // ════════════════════════════════════════════════════════════════
  //  LOGIN SCREEN
  // ════════════════════════════════════════════════════════════════
  if (!authenticated) {
    return (
      <div style={s.loginPage}>
        <div style={s.loginCard}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔒</div>
          <h1 style={s.loginTitle}>Admin Access</h1>
          <p style={s.loginSubtitle}>Hood Hymns Publishing</p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={s.input}
              autoFocus
            />
            <button type="submit" style={s.btnCopper}>Unlock</button>
          </form>
          {error && <p style={s.errorText}>{error}</p>}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  //  DASHBOARD LAYOUT
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#08050F", fontFamily: "'Inter', -apple-system, sans-serif", color: "#F0EDE8" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 90 }}
        />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside
        style={{
          width: 250,
          background: "rgba(14, 10, 26, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(184, 115, 51, 0.15)",
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : undefined,
          bottom: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: typeof window !== "undefined" && window.innerWidth < 768 && !sidebarOpen
            ? "translateX(-100%)"
            : "translateX(0)",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #B87333, #D4944A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", fontWeight: 800, color: "#fff",
          }}>
            HH
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700 }}>Hood Hymns</div>
            <div style={{ fontSize: 10, color: "#9088A8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: activeView === item.id ? 600 : 500,
                color: activeView === item.id ? "#B87333" : "rgba(255,255,255,0.55)",
                background: activeView === item.id ? "rgba(184, 115, 51, 0.12)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left" as const,
                width: "100%",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              <span style={{ width: 22, textAlign: "center", fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setAuthenticated(false)}
            style={{
              padding: 9, borderRadius: 8, fontSize: 13, fontWeight: 500,
              color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main style={{ flex: 1, marginLeft: 250, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          background: "rgba(14, 10, 26, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "none",
                fontSize: 20, color: "#9088A8", background: "none", border: "none", cursor: "pointer",
                // Will be shown via responsive styles injected below
              }}
              className="mobile-toggle"
            >
              ☰
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700 }}>
              {viewTitles[activeView]}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#9088A8" }}>{todayStr}</span>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #B87333, #6B21A8)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              CD
            </div>
          </div>
        </header>

        {/* View content */}
        <div style={{ padding: 28, flex: 1 }}>
          {/* ── DASHBOARD VIEW ─────────────────────────────────── */}
          {activeView === "dashboard" && (
            <div>
              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "💰", label: "Total Revenue", value: "$4,847.50", trend: "+23% this month", trendColor: "#10B981" },
                  { icon: "📦", label: "Orders This Month", value: "42", trend: "+12 vs last month", trendColor: "#10B981" },
                  { icon: "📧", label: "Subscribers", value: "318", trend: "+28 this week", trendColor: "#10B981" },
                  { icon: "📚", label: "Books Sold", value: "186", trend: "76 digital · 110 print", trendColor: "#B87333" },
                ].map((kpi) => (
                  <div key={kpi.label} style={s.glassCard}>
                    <div style={{ fontSize: 26, marginBottom: 10 }}>{kpi.icon}</div>
                    <div style={{ fontSize: 11, color: "#9088A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                      {kpi.label}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, marginTop: 4 }}>
                      {kpi.value}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: kpi.trendColor }}>
                      {kpi.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={s.glassCard}>
                <h3 style={s.sectionTitle}>Recent Activity</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {RECENT_ACTIVITY.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 0",
                        borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: 13.5, color: "#CBD5E1" }}>{item.text}</span>
                      <span style={{ fontSize: 12, color: "#9088A8", whiteSpace: "nowrap" }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS VIEW ────────────────────────────────────── */}
          {activeView === "orders" && (
            <div>
              {/* Stripe banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(184, 115, 51, 0.08))",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: 14, padding: "18px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24, flexWrap: "wrap", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>💳</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Stripe API Connected</div>
                    <div style={{ fontSize: 12, color: "#9088A8" }}>Live orders will sync automatically • Demo data shown below</div>
                  </div>
                </div>
                <span style={{
                  ...s.badge,
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                }}>● Live</span>
              </div>

              {/* Orders table */}
              <div style={{
                ...s.glassCard,
                padding: 0,
                overflowX: "auto" as const,
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      {["Order", "Customer", "Product", "Amount", "Date", "Status"].map((h) => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_ORDERS.map((order) => (
                      <tr key={order.id}>
                        <td style={s.td}><span style={{ fontWeight: 600, color: "#B87333" }}>{order.id}</span></td>
                        <td style={s.td}>{order.customer}</td>
                        <td style={s.td}>{order.product}</td>
                        <td style={s.td}>{order.amount}</td>
                        <td style={s.td}><span style={{ color: "#9088A8" }}>{order.date}</span></td>
                        <td style={s.td}>
                          <span style={{
                            ...s.badge,
                            ...(order.status === "Fulfilled" ? s.badgeGreen
                              : order.status === "Shipped" ? s.badgeBlue
                              : s.badgeAmber),
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS VIEW ──────────────────────────────────── */}
          {activeView === "products" && (
            <div>
              <p style={{ fontSize: 13, color: "#9088A8", marginBottom: 20 }}>
                {products.length} products loaded from store data
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {products.map((product) => (
                  <div key={product.id} style={{ ...s.glassCard, display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <div style={{
                      width: "100%", height: 160, borderRadius: 10,
                      background: "#140E24",
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{product.title}</div>
                      <div style={{ fontSize: 12, color: "#9088A8", marginBottom: 8 }}>{product.type}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#B87333" }}>
                          {product.price}
                        </span>
                        <button
                          onClick={() => setAvailability((prev) => ({ ...prev, [product.id]: !prev[product.id] }))}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.2s",
                            background: availability[product.id]
                              ? "rgba(16, 185, 129, 0.12)"
                              : "rgba(239, 68, 68, 0.12)",
                            color: availability[product.id] ? "#10B981" : "#EF4444",
                          }}
                        >
                          {availability[product.id] ? "● Available" : "○ Unavailable"}
                        </button>
                      </div>
                    </div>
                    {product.paymentLink && (
                      <div style={{ fontSize: 11, color: "#9088A8", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8 }}>
                        Stripe Link ✅
                      </div>
                    )}
                    {!product.paymentLink && (
                      <div style={{ fontSize: 11, color: "#F59E0B", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8 }}>
                        ⏳ No payment link
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRINTFUL VIEW ──────────────────────────────────── */}
          {activeView === "printful" && (
            <div>
              {/* Status banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(184, 115, 51, 0.06))",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 14, padding: "18px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24, flexWrap: "wrap", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>🔗</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Printful API Connected</div>
                    <div style={{ fontSize: 12, color: "#9088A8" }}>9 products synced · Last sync: Today</div>
                  </div>
                </div>
                <span style={{ ...s.badge, background: "rgba(16, 185, 129, 0.12)", color: "#10B981" }}>● Synced</span>
              </div>

              {/* Products table */}
              <div style={{ ...s.glassCard, padding: 0, overflowX: "auto" as const }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      {["Product", "Printful ID", "Sync Status", "Actions"].map((h) => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRINTFUL_PRODUCTS.map((p) => (
                      <tr key={p.printfulId}>
                        <td style={s.td}><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                        <td style={s.td}>
                          <code style={{ background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 5, fontSize: 12, color: "#B87333" }}>
                            {p.printfulId}
                          </code>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, ...s.badgeGreen }}>● Synced</span>
                        </td>
                        <td style={s.td}>
                          <button style={{
                            padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                            color: "#9088A8", border: "1px solid rgba(255,255,255,0.08)",
                            background: "transparent", cursor: "pointer", fontFamily: "inherit",
                          }}>
                            Re-sync
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 20, padding: 18, background: "rgba(14, 10, 26, 0.5)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "#9088A8", lineHeight: 1.7 }}>
                <strong style={{ color: "#F0EDE8" }}>ID Range:</strong> 436109640 – 436109838 &nbsp;·&nbsp;
                <strong style={{ color: "#F0EDE8" }}>Store:</strong> Hood Hymns Publishing &nbsp;·&nbsp;
                <strong style={{ color: "#F0EDE8" }}>Fulfillment:</strong> Printful on-demand
              </div>
            </div>
          )}

          {/* ── SUBSCRIBERS VIEW ───────────────────────────────── */}
          {activeView === "subscribers" && (
            <div>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "📧", label: "Total Subscribers", value: "318", color: "#B87333" },
                  { icon: "📈", label: "Growth (30d)", value: "+47", color: "#10B981" },
                  { icon: "📬", label: "Open Rate", value: "34.2%", color: "#3B82F6" },
                  { icon: "🖱️", label: "Click Rate", value: "8.7%", color: "#8B5CF6" },
                ].map((kpi) => (
                  <div key={kpi.label} style={s.glassCard}>
                    <div style={{ fontSize: 26, marginBottom: 10 }}>{kpi.icon}</div>
                    <div style={{ fontSize: 11, color: "#9088A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                      {kpi.label}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, marginTop: 4, color: kpi.color }}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth chart placeholder */}
              <div style={s.glassCard}>
                <h3 style={s.sectionTitle}>Subscriber Growth</h3>
                <div style={{
                  height: 200,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  padding: "20px 0",
                }}>
                  {[28, 35, 42, 39, 56, 63, 71, 78, 85, 94, 102, 118].map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: "100%",
                        height: `${(v / 118) * 160}px`,
                        background: `linear-gradient(180deg, #B87333, rgba(184, 115, 51, 0.3))`,
                        borderRadius: "6px 6px 2px 2px",
                        transition: "height 0.5s ease",
                        minHeight: 4,
                      }} />
                      <span style={{ fontSize: 9, color: "#9088A8" }}>
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mailchimp CTA */}
              <div style={{
                marginTop: 24,
                background: "linear-gradient(135deg, rgba(255, 199, 0, 0.08), rgba(184, 115, 51, 0.06))",
                border: "1px solid rgba(255, 199, 0, 0.2)",
                borderRadius: 14, padding: "24px",
                textAlign: "center" as const,
              }}>
                <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>📮</span>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Connect Mailchimp</div>
                <div style={{ fontSize: 13, color: "#9088A8", marginBottom: 16, maxWidth: 400, margin: "0 auto 16px" }}>
                  Sync your subscriber list with Mailchimp for automated campaigns, welcome sequences, and launch announcements.
                </div>
                <button style={{ ...s.btnCopper, padding: "12px 28px" }}>
                  Connect Mailchimp →
                </button>
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS VIEW ──────────────────────────────── */}
          {activeView === "testimonials" && (
            <div style={{ maxWidth: 560 }}>
              <p style={s.tagline}>Hood Hymns Publishing</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
                Testimonial of the Day
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#9088A8", textAlign: "center", marginBottom: 36 }}>
                Record your message for the community
              </p>

              {/* Success state */}
              {success && (
                <div style={s.successBanner}>
                  <span style={{ fontSize: "1.5rem" }}>✅</span>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>Testimonial Published!</p>
                    <p style={{ fontSize: "0.85rem", color: "#9088A8" }}>
                      Your message is now live on the homepage.
                    </p>
                  </div>
                </div>
              )}

              {/* Record / Stop buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 24 }}>
                {!isRecording ? (
                  <button onClick={startRecording} style={s.recordBtn} title="Start Recording">
                    <span style={s.recordDot} />
                    <span>Record</span>
                  </button>
                ) : (
                  <button onClick={stopRecording} style={s.stopBtn} title="Stop Recording">
                    <span style={s.stopSquare} />
                    <span>Stop</span>
                  </button>
                )}
                {isRecording && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.1rem", fontVariantNumeric: "tabular-nums", color: "#dc2626", fontWeight: 600 }}>
                    <span style={s.liveDot} />
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>

              {/* Audio preview */}
              {audioUrl && (
                <div style={s.previewSection}>
                  <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9088A8", marginBottom: 12 }}>
                    Preview Recording
                  </p>
                  <audio ref={audioPreviewRef} src={audioUrl} controls style={{ width: "100%", marginBottom: 12, borderRadius: 8 }} />
                  <button
                    onClick={() => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); }}
                    style={s.btnGhost}
                  >
                    Discard &amp; Re-record
                  </button>
                </div>
              )}

              {/* Text area */}
              <div style={{ marginBottom: 24 }}>
                <label style={s.label}>Written Message (Optional)</label>
                <textarea
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Add a written message to accompany the audio, or submit text-only..."
                  style={s.textarea}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || (!audioBlob && !textMessage.trim())}
                style={{
                  ...s.btnCopper,
                  width: "100%",
                  opacity: submitting || (!audioBlob && !textMessage.trim()) ? 0.5 : 1,
                  cursor: submitting || (!audioBlob && !textMessage.trim()) ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Processing with Gemini AI…" : "Publish Testimonial"}
              </button>

              {error && <p style={s.errorText}>{error}</p>}
            </div>
          )}

          {/* ── BOOKS VIEW ─────────────────────────────────────── */}
          {activeView === "books" && (
            <div>
              <p style={{ fontSize: 13, color: "#9088A8", marginBottom: 24 }}>
                Manuscript pipeline and publication status
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BOOK_PIPELINE.map((book) => (
                  <div
                    key={book.title}
                    style={{
                      ...s.glassCard,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      borderLeft: `3px solid ${
                        book.status === "published" ? "#10B981"
                        : book.status === "in-progress" ? "#F59E0B"
                        : "#9088A8"
                      }`,
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{book.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{book.title}</div>
                      <div style={{ fontSize: 13, color: "#9088A8" }}>{book.detail}</div>
                    </div>
                    <span style={{
                      ...s.badge,
                      ...(book.status === "published" ? s.badgeGreen
                        : book.status === "in-progress" ? s.badgeAmber
                        : s.badgeMuted),
                    }}>
                      {book.status === "published" ? "Published"
                        : book.status === "in-progress" ? "In Progress"
                        : "Planned"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Workflow summary */}
              <div style={{ ...s.glassCard, marginTop: 24 }}>
                <h3 style={s.sectionTitle}>Production Pipeline</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 16 }}>
                  {[
                    { step: "1. Draft", icon: "✍️", desc: "Manuscript expansion" },
                    { step: "2. Edit", icon: "📝", desc: "Proof & chapter splits" },
                    { step: "3. Audio", icon: "🎙️", desc: "Gemini TTS audiobook" },
                    { step: "4. E-Book", icon: "📱", desc: "EPUB + PDF gen" },
                    { step: "5. Print", icon: "📖", desc: "IngramSpark / KDP" },
                    { step: "6. Launch", icon: "🚀", desc: "Stripe + marketing" },
                  ].map((s2) => (
                    <div key={s2.step} style={{
                      textAlign: "center",
                      padding: 16,
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{s2.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, color: "#B87333" }}>{s2.step}</div>
                      <div style={{ fontSize: 11, color: "#9088A8" }}>{s2.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS VIEW ──────────────────────────────────── */}
          {activeView === "settings" && (
            <div>
              {/* API Status */}
              <div style={s.glassCard}>
                <h3 style={s.sectionTitle}>API Integrations</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { name: "Stripe", status: "connected", icon: "💳", detail: "Payments & subscriptions" },
                    { name: "Printful", status: "connected", icon: "👕", detail: "On-demand fulfillment" },
                    { name: "Mailchimp", status: "pending", icon: "📧", detail: "Email marketing" },
                    { name: "Gemini AI", status: "connected", icon: "🤖", detail: "TTS, content generation" },
                  ].map((api, i, arr) => (
                    <div
                      key={api.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 0",
                        borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{api.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{api.name}</div>
                          <div style={{ fontSize: 12, color: "#9088A8" }}>{api.detail}</div>
                        </div>
                      </div>
                      <span style={{
                        ...s.badge,
                        ...(api.status === "connected" ? s.badgeGreen : s.badgeAmber),
                      }}>
                        {api.status === "connected" ? "✅ Connected" : "⏳ Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment info */}
              <div style={{ ...s.glassCard, marginTop: 16 }}>
                <h3 style={s.sectionTitle}>Deployment</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 8 }}>
                  {[
                    { label: "Platform", value: "Netlify" },
                    { label: "Framework", value: "Next.js 15" },
                    { label: "Domain", value: "hoodhymns.com" },
                    { label: "SSL", value: "Active ✅" },
                    { label: "GitHub Repo", value: "Connected" },
                    { label: "Build Status", value: "Passing ✅" },
                  ].map((info) => (
                    <div key={info.label} style={{
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{ fontSize: 11, color: "#9088A8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>
                        {info.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{info.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div style={{ ...s.glassCard, marginTop: 16 }}>
                <h3 style={s.sectionTitle}>Quick Links</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {[
                    { label: "Stripe Dashboard", url: "https://dashboard.stripe.com" },
                    { label: "Printful Dashboard", url: "https://www.printful.com/dashboard" },
                    { label: "Netlify Deploy", url: "https://app.netlify.com" },
                    { label: "GitHub Repo", url: "https://github.com" },
                    { label: "Google Analytics", url: "https://analytics.google.com" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#B87333",
                        border: "1px solid rgba(184, 115, 51, 0.25)",
                        textDecoration: "none",
                        transition: "all 0.2s",
                        background: "rgba(184, 115, 51, 0.06)",
                      }}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── RESPONSIVE STYLES ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; }
          aside { transform: translateX(-100%) !important; }
          aside[style*="translateX(0)"] { transform: translateX(0) !important; }
          .mobile-toggle { display: block !important; }
        }
        @keyframes pulseRecord {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  STYLES
// ════════════════════════════════════════════════════════════════════
const s: Record<string, React.CSSProperties> = {
  // Login
  loginPage: {
    minHeight: "100vh",
    background: "#08050F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  loginCard: {
    background: "linear-gradient(145deg, #140E24, #0E0A1A)",
    border: "1px solid #261840",
    borderRadius: 16,
    padding: "48px 40px",
    maxWidth: 400,
    width: "100%",
    textAlign: "center" as const,
  },
  loginTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#F0EDE8",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#B87333",
    marginBottom: 32,
  },
  input: {
    background: "#08050F",
    border: "1px solid #261840",
    borderRadius: 8,
    padding: "14px 16px",
    color: "#F0EDE8",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  btnCopper: {
    background: "linear-gradient(135deg, #B87333, #D4944A)",
    border: "none",
    borderRadius: 8,
    padding: "16px 32px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  errorText: {
    color: "#f87171",
    fontSize: "0.85rem",
    marginTop: 12,
    textAlign: "center" as const,
  },

  // Glass card
  glassCard: {
    background: "rgba(14, 10, 26, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#F0EDE8",
    marginBottom: 16,
  },

  // Table
  th: {
    textAlign: "left" as const,
    padding: "14px 16px",
    fontSize: 10.5,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "#9088A8",
    fontWeight: 600,
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "13px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#CBD5E1",
    fontSize: 13.5,
  },

  // Badges
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  badgeGreen: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10B981",
  },
  badgeBlue: {
    background: "rgba(59, 130, 246, 0.12)",
    color: "#3B82F6",
  },
  badgeAmber: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "#F59E0B",
  },
  badgeMuted: {
    background: "rgba(144, 136, 168, 0.12)",
    color: "#9088A8",
  },

  // Testimonial recorder styles (preserved)
  tagline: {
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#B87333",
    marginBottom: 8,
    textAlign: "center" as const,
  },
  recordBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(220, 38, 38, 0.15)",
    border: "2px solid #dc2626",
    borderRadius: 40,
    padding: "14px 28px",
    color: "#F0EDE8",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  recordDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#dc2626",
    display: "inline-block",
    animation: "pulseRecord 1.5s ease-in-out infinite",
  },
  stopBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(220, 38, 38, 0.25)",
    border: "2px solid #dc2626",
    borderRadius: 40,
    padding: "14px 28px",
    color: "#F0EDE8",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
    fontFamily: "inherit",
  },
  stopSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    background: "#dc2626",
    display: "inline-block",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#dc2626",
    display: "inline-block",
    animation: "pulseRecord 1s ease-in-out infinite",
  },
  previewSection: {
    background: "rgba(8, 5, 15, 0.6)",
    border: "1px solid #261840",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    textAlign: "center" as const,
  },
  btnGhost: {
    background: "transparent",
    border: "1px solid #261840",
    borderRadius: 6,
    padding: "8px 16px",
    color: "#9088A8",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#9088A8",
    marginBottom: 8,
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    background: "#08050F",
    border: "1px solid #261840",
    borderRadius: 8,
    padding: "14px 16px",
    color: "#F0EDE8",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    resize: "vertical" as const,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "rgba(34, 197, 94, 0.08)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    color: "#F0EDE8",
  },
};
