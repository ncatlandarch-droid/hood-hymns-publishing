"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db, googleProvider, ADMIN_EMAILS } from "@/lib/firebase";

// ════════════════════════════════════════════════════════════════════
//  TYPES
// ════════════════════════════════════════════════════════════════════
type Tab =
  | "dashboard"
  | "orders"
  | "products"
  | "merch"
  | "analytics"
  | "cliff"
  | "settings";

interface TabDef {
  id: Tab;
  icon: string;
  label: string;
}

const TABS: TabDef[] = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "products", icon: "🏷️", label: "Products" },
  { id: "merch", icon: "👕", label: "Merch" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "cliff", icon: "🏔️", label: "Cliff Tracker" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

interface GumroadProduct {
  id: string;
  name: string;
  price: number;
  formatted_price?: string;
  thumbnail_url?: string;
  preview_url?: string;
  url?: string;
  short_url?: string;
  sales_count?: number;
  published?: boolean;
}

interface GumroadSale {
  id: string;
  email: string;
  product_name: string;
  price: number;
  created_at: string;
  refunded?: boolean;
  full_name?: string;
  order_number?: number;
}

interface PrintifyProduct {
  id: string;
  title: string;
  image: string | null;
  variants: number;
  minPrice: number;
}

interface PrintifyOrder {
  id: string;
  status: string;
  created_at: string;
  line_items?: Array<{
    title: string;
    quantity: number;
    metadata?: { price?: number };
  }>;
  address_to?: { first_name?: string; last_name?: string; email?: string };
  total_price?: number;
  total_shipping?: number;
}

interface GumroadData {
  success: boolean;
  products: GumroadProduct[];
  sales: GumroadSale[];
  totalRevenue: number;
  totalSales: number;
  salesByProduct: Record<string, { count: number; revenue: number }>;
  monthlyRevenue: Record<string, number>;
  error?: string;
}

interface PrintifyData {
  success: boolean;
  products: PrintifyProduct[];
  totalProducts: number;
  orders: PrintifyOrder[];
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  error?: string;
}

interface AnalyticsDoc {
  page: string;
  views: number;
  visitors: number;
  date: string;
}

interface CliffDoc {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cliffReached: boolean;
  cliffDate: string | null;
  totalContributed: number;
  graduated: boolean;
  lastUpdated: string;
}

// ════════════════════════════════════════════════════════════════════
//  ADMIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  // ── Auth State ──
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Dashboard State ──
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [gumroad, setGumroad] = useState<GumroadData | null>(null);
  const [printify, setPrintify] = useState<PrintifyData | null>(null);
  const [gumroadLoading, setGumroadLoading] = useState(true);
  const [printifyLoading, setPrintifyLoading] = useState(true);
  const [gumroadError, setGumroadError] = useState("");
  const [printifyError, setPrintifyError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Analytics State ──
  const [analytics, setAnalytics] = useState<AnalyticsDoc[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // ── Cliff State ──
  const [cliffData, setCliffData] = useState<CliffDoc | null>(null);
  const [cliffLoading, setCliffLoading] = useState(true);

  // ════════════════════════════════════════════════════════════════
  //  AUTH
  // ════════════════════════════════════════════════════════════════
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u && u.email) {
        setIsAdmin(ADMIN_EMAILS.includes(u.email));
      } else {
        setIsAdmin(false);
      }
    });
    return unsub;
  }, []);

  async function handleGoogleLogin() {
    setAuthError("");
    setLoginLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setAuthError(e.message || "Google sign-in failed");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: unknown) {
      const er = err as { code?: string; message?: string };
      if (er.code === "auth/invalid-credential" || er.code === "auth/wrong-password") {
        setAuthError("Invalid email or password");
      } else if (er.code === "auth/user-not-found") {
        setAuthError("No account found with this email");
      } else {
        setAuthError(er.message || "Sign-in failed");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  // ════════════════════════════════════════════════════════════════
  //  DATA FETCHING
  // ════════════════════════════════════════════════════════════════
  const fetchGumroad = useCallback(async () => {
    setGumroadLoading(true);
    setGumroadError("");
    try {
      const res = await fetch("/api/admin/gumroad");
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Gumroad fetch failed");
      setGumroad(data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setGumroadError(e.message || "Failed to load Gumroad data");
    } finally {
      setGumroadLoading(false);
    }
  }, []);

  const fetchPrintify = useCallback(async () => {
    setPrintifyLoading(true);
    setPrintifyError("");
    try {
      const res = await fetch("/api/admin/printify");
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Printify fetch failed");
      setPrintify(data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setPrintifyError(e.message || "Failed to load Printify data");
    } finally {
      setPrintifyLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchGumroad(), fetchPrintify()]);
    setLastRefresh(new Date());
    setRefreshing(false);
  }, [fetchGumroad, fetchPrintify]);

  // Initial data load
  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin, fetchAll]);

  // ── Firestore: Analytics ──
  useEffect(() => {
    if (!isAdmin) return;
    setAnalyticsLoading(true);
    try {
      const q = query(
        collection(db, "analytics"),
        orderBy("date", "desc"),
        limit(50)
      );
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => d.data() as AnalyticsDoc);
        setAnalytics(docs);
        setAnalyticsLoading(false);
      }, () => {
        setAnalyticsLoading(false);
      });
      return unsub;
    } catch {
      setAnalyticsLoading(false);
    }
  }, [isAdmin]);

  // ── Firestore: Cliff Tracker ──
  useEffect(() => {
    if (!isAdmin) return;
    setCliffLoading(true);
    try {
      const unsub = onSnapshot(collection(db, "cliff-tracker"), (snap) => {
        if (!snap.empty) {
          setCliffData(snap.docs[0].data() as CliffDoc);
        }
        setCliffLoading(false);
      }, () => {
        setCliffLoading(false);
      });
      return unsub;
    } catch {
      setCliffLoading(false);
    }
  }, [isAdmin]);

  // ════════════════════════════════════════════════════════════════
  //  COMPUTED VALUES
  // ════════════════════════════════════════════════════════════════
  const totalRevenue = gumroad?.totalRevenue || 0;
  const totalGumroadSales = gumroad?.totalSales || 0;
  const totalPrintifyOrders = printify?.totalOrders || 0;
  const totalOrders = totalGumroadSales + totalPrintifyOrders;
  const totalProducts = (gumroad?.products?.length || 0) + (printify?.totalProducts || 0);

  // Cliff computation
  const CLIFF_AMOUNT = 2500;
  const GRADUATION_CAP = 10000;
  const estimatedExpenseRate = 0.35; // 35% estimated expenses
  const netProfit = cliffData?.netProfit ?? totalRevenue * (1 - estimatedExpenseRate);
  const cliffReached = cliffData?.cliffReached ?? netProfit >= CLIFF_AMOUNT;
  const totalContributed = cliffData?.totalContributed ?? 0;
  const graduated = cliffData?.graduated ?? totalContributed >= GRADUATION_CAP;

  const cliffProgress = cliffReached ? 100 : Math.min(100, (netProfit / CLIFF_AMOUNT) * 100);
  const graduationProgress = graduated
    ? 100
    : Math.min(100, (totalContributed / GRADUATION_CAP) * 100);

  // Combined orders for the Orders tab
  const combinedOrders = [
    ...(gumroad?.sales || []).map((s) => ({
      id: s.order_number ? `GR-${s.order_number}` : s.id.slice(0, 8),
      customer: s.full_name || s.email?.split("@")[0] || "Unknown",
      product: s.product_name || "Unknown",
      amount: s.price / 100,
      date: s.created_at,
      source: "Gumroad" as const,
      status: s.refunded ? ("Refunded" as const) : ("Fulfilled" as const),
    })),
    ...(printify?.orders || []).map((o) => ({
      id: `PF-${o.id.slice(0, 6)}`,
      customer: o.address_to
        ? `${o.address_to.first_name || ""} ${o.address_to.last_name || ""}`.trim() || o.address_to.email || "Unknown"
        : "Unknown",
      product: o.line_items?.[0]?.title || "Merch Order",
      amount: (o.total_price || 0) / 100,
      date: o.created_at,
      source: "Printify" as const,
      status:
        o.status === "fulfilled" || o.status === "delivery-confirmed"
          ? ("Fulfilled" as const)
          : o.status === "shipping" || o.status === "in-transit"
          ? ("Shipped" as const)
          : ("Pending" as const),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Monthly revenue for chart
  const monthlyData = gumroad?.monthlyRevenue || {};
  const sortedMonths = Object.keys(monthlyData).sort();
  const last6Months = sortedMonths.slice(-6);
  const maxMonthlyRev = Math.max(...last6Months.map((m) => (monthlyData[m] || 0) / 100), 1);

  // ════════════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════════════
  function formatCurrency(cents: number) {
    return `$${(cents).toFixed(2)}`;
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function monthLabel(yyyymm: string) {
    try {
      const [y, m] = yyyymm.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
    } catch {
      return yyyymm;
    }
  }

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  // ════════════════════════════════════════════════════════════════
  //  LOADING STATE
  // ════════════════════════════════════════════════════════════════
  if (authLoading) {
    return (
      <>
        <style>{cssReset}</style>
        <div className="hh-admin" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", background: "var(--bg-primary)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════
  //  LOGIN GATE
  // ════════════════════════════════════════════════════════════════
  if (!user) {
    return (
      <>
        <style>{cssReset}</style>
        <div className="hh-admin" id="login-gate">
          <div style={{
            width: 60, height: 60, borderRadius: 14,
            background: "linear-gradient(135deg, var(--accent-copper), #D4944A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem", fontWeight: 800, color: "#fff",
            marginBottom: "1.5rem",
            filter: "drop-shadow(0 0 20px rgba(184,115,51,0.3))",
          }}>HH</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Hood Hymns Admin
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Sign in with your admin account to access the dashboard.
          </p>

          <div className="login-form">
            {/* Google Sign In */}
            <button className="login-btn login-btn--google" onClick={handleGoogleLogin} disabled={loginLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="login-divider">or</div>

            {/* Email/Password */}
            <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email Address"
                autoComplete="email"
                required
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button type="submit" className="login-btn" disabled={loginLoading}>
                {loginLoading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {authError && <div className="error">{authError}</div>}
          </div>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════
  //  ACCESS DENIED
  // ════════════════════════════════════════════════════════════════
  if (!isAdmin) {
    return (
      <>
        <style>{cssReset}</style>
        <div className="hh-admin" id="access-denied" style={{ display: "flex" }}>
          <div className="icon">🚫</div>
          <h2>Access Denied</h2>
          <p>
            <strong>{user.email}</strong> is not an authorized admin account.
            Contact the site owner for access.
          </p>
          <button className="login-btn" onClick={handleLogout} style={{ maxWidth: 200 }}>
            Sign Out
          </button>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════
  //  MAIN DASHBOARD
  // ════════════════════════════════════════════════════════════════
  const isLoading = gumroadLoading || printifyLoading;

  return (
    <>
      <style>{cssReset}</style>
      <div className="hh-admin" id="dashboard">
        {/* ── TOP BAR ── */}
        <div className="topbar">
          <div className="topbar__left">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent-copper), #D4944A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 800, color: "#fff",
              filter: "drop-shadow(0 0 8px rgba(184,115,51,0.2))",
            }}>HH</div>
            <h1>Hood Hymns Publishing</h1>
            <span className="topbar__badge">ADMIN</span>
          </div>
          <div className="topbar__right">
            {lastRefresh && (
              <span className="topbar__timer">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt="Avatar"
                style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }}
              />
            ) : (
              <div className="topbar__avatar">{userInitials}</div>
            )}
            <span className="topbar__user">{user.displayName || user.email}</span>
            <button className="topbar__logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="tabs">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ marginRight: 6 }}>{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="content">
          {/* Refresh Bar */}
          <div className="refresh-bar">
            <span className="refresh-bar__time">
              {lastRefresh
                ? `Data as of ${lastRefresh.toLocaleString()}`
                : "Loading data..."}
            </span>
            <button
              className="refresh-bar__btn"
              onClick={fetchAll}
              disabled={refreshing}
            >
              {refreshing ? "⟳ Refreshing..." : "⟳ Refresh Data"}
            </button>
          </div>

          {/* ════════════════════════════════════════════════════════
              DASHBOARD TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="panel active">
              {/* Stat Cards */}
              {isLoading ? (
                <div className="skeleton-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton-card" />
                  ))}
                </div>
              ) : (
                <div className="summary-grid">
                  {/* Revenue */}
                  <div className="summary-card">
                    <div className="summary-card__icon">💰</div>
                    <div className="summary-card__label">Total Revenue</div>
                    <div className="summary-card__value green">
                      {formatCurrency(totalRevenue)}
                    </div>
                    <div className="summary-card__note">Gumroad sales</div>
                  </div>
                  {/* Orders */}
                  <div className="summary-card">
                    <div className="summary-card__icon">📦</div>
                    <div className="summary-card__label">Total Orders</div>
                    <div className="summary-card__value copper">
                      {totalOrders}
                    </div>
                    <div className="summary-card__note">
                      {totalGumroadSales} Gumroad · {totalPrintifyOrders} Printify
                    </div>
                  </div>
                  {/* Products */}
                  <div className="summary-card">
                    <div className="summary-card__icon">🏷️</div>
                    <div className="summary-card__label">Products Listed</div>
                    <div className="summary-card__value blue">
                      {totalProducts}
                    </div>
                    <div className="summary-card__note">
                      {gumroad?.products?.length || 0} digital · {printify?.totalProducts || 0} merch
                    </div>
                  </div>
                  {/* Cliff */}
                  <div className="summary-card">
                    <div className="summary-card__icon">🏔️</div>
                    <div className="summary-card__label">Cliff Progress</div>
                    <div className={`summary-card__value ${cliffReached ? "green" : "gold"}`}>
                      {cliffReached ? "REACHED ✓" : `${cliffProgress.toFixed(0)}%`}
                    </div>
                    <div className="summary-card__note">
                      {cliffReached
                        ? `Graduated: ${graduationProgress.toFixed(0)}% → $10K`
                        : `$${netProfit.toFixed(0)} / $${CLIFF_AMOUNT}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Chart */}
              <div className="section-header">
                <h2>Monthly Revenue</h2>
                <span>{last6Months.length > 0 ? "Last 6 months" : "No data yet"}</span>
              </div>
              {isLoading ? (
                <div className="skeleton-table" />
              ) : last6Months.length > 0 ? (
                <div className="table-wrap" style={{ padding: "1.5rem" }}>
                  <div style={{
                    display: "flex", alignItems: "flex-end", gap: 8,
                    height: 180, padding: "0.5rem 0",
                  }}>
                    {last6Months.map((m) => {
                      const val = (monthlyData[m] || 0) / 100;
                      const pct = (val / maxMonthlyRev) * 100;
                      return (
                        <div key={m} style={{
                          flex: 1, display: "flex", flexDirection: "column",
                          alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end",
                        }}>
                          <span style={{ fontSize: "0.7rem", color: "var(--accent-copper)", fontWeight: 600 }}>
                            ${val.toFixed(0)}
                          </span>
                          <div style={{
                            width: "100%", maxWidth: 60,
                            height: `${Math.max(pct, 4)}%`,
                            background: "linear-gradient(180deg, var(--accent-copper), rgba(184,115,51,0.3))",
                            borderRadius: "6px 6px 2px 2px",
                            transition: "height 0.5s ease",
                          }} />
                          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                            {monthLabel(m)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📊</div>
                  <p>No revenue data yet. Sales will appear here once processed.</p>
                </div>
              )}

              {/* Recent Orders */}
              <div className="section-header" style={{ marginTop: "2rem" }}>
                <h2>Recent Orders</h2>
                <span>{combinedOrders.length} total</span>
              </div>
              {isLoading ? (
                <div className="skeleton-table" />
              ) : combinedOrders.length > 0 ? (
                <div className="table-wrap">
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>Amount</th>
                          <th>Source</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {combinedOrders.slice(0, 10).map((o, i) => (
                          <tr key={`${o.id}-${i}`}>
                            <td style={{ fontWeight: 600, color: "var(--accent-copper)" }}>{o.id}</td>
                            <td>{o.customer}</td>
                            <td>{o.product}</td>
                            <td className="amount positive">{formatCurrency(o.amount)}</td>
                            <td>
                              <span className={`badge badge--${o.source === "Gumroad" ? "gumroad" : "printify"}`}>
                                {o.source}
                              </span>
                            </td>
                            <td style={{ color: "var(--text-muted)" }}>{formatDate(o.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📦</div>
                  <p>No orders yet. Orders from Gumroad and Printify will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              ORDERS TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div className="panel active">
              <div className="section-header">
                <h2>All Orders</h2>
                <span>{combinedOrders.length} orders from Gumroad + Printify</span>
              </div>
              {isLoading ? (
                <div className="skeleton-table" style={{ height: 400 }} />
              ) : combinedOrders.length > 0 ? (
                <div className="table-wrap">
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Source</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {combinedOrders.map((o, i) => (
                          <tr key={`${o.id}-${i}`}>
                            <td style={{ fontWeight: 600, color: "var(--accent-copper)" }}>{o.id}</td>
                            <td>{o.customer}</td>
                            <td>{o.product}</td>
                            <td className="amount positive">{formatCurrency(o.amount)}</td>
                            <td style={{ color: "var(--text-muted)" }}>{formatDate(o.date)}</td>
                            <td>
                              <span className={`badge badge--${o.source === "Gumroad" ? "gumroad" : "printify"}`}>
                                {o.source}
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge--${o.status.toLowerCase()}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📦</div>
                  <p>No orders yet. Connect your Gumroad and Printify accounts to see orders.</p>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              PRODUCTS TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "products" && (
            <div className="panel active">
              <div className="section-header">
                <h2>All Products</h2>
                <span>{totalProducts} across Gumroad + Printify</span>
              </div>
              {isLoading ? (
                <div className="skeleton-grid">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="skeleton-card" style={{ height: 200 }} />
                  ))}
                </div>
              ) : (
                <div className="product-grid">
                  {/* Gumroad Products */}
                  {(gumroad?.products || []).map((p) => (
                    <div key={`gr-${p.id}`} className="product-card">
                      {p.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail_url} alt={p.name} />
                      ) : (
                        <div style={{
                          width: "100%", height: 140, borderRadius: "var(--radius-sm)",
                          background: "rgba(255,255,255,0.03)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "2rem", marginBottom: "0.75rem",
                        }}>📚</div>
                      )}
                      <div className="product-card__name">{p.name}</div>
                      <div className="product-card__meta">
                        <span className="badge badge--gumroad" style={{ marginRight: 6 }}>Gumroad</span>
                        <span style={{ color: "var(--accent-copper)", fontWeight: 600 }}>
                          {p.formatted_price || `$${(p.price / 100).toFixed(2)}`}
                        </span>
                      </div>
                      {p.short_url && (
                        <a
                          href={p.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="product-card__link"
                        >
                          View on Gumroad ↗
                        </a>
                      )}
                    </div>
                  ))}
                  {/* Printify Products */}
                  {(printify?.products || []).map((p) => (
                    <div key={`pf-${p.id}`} className="product-card">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} />
                      ) : (
                        <div style={{
                          width: "100%", height: 140, borderRadius: "var(--radius-sm)",
                          background: "rgba(255,255,255,0.03)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "2rem", marginBottom: "0.75rem",
                        }}>👕</div>
                      )}
                      <div className="product-card__name">{p.title}</div>
                      <div className="product-card__meta">
                        <span className="badge badge--printify" style={{ marginRight: 6 }}>Printify</span>
                        <span style={{ color: "var(--accent-copper)", fontWeight: 600 }}>
                          ${p.minPrice.toFixed(2)}+
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                        {p.variants} variants
                      </div>
                    </div>
                  ))}
                  {totalProducts === 0 && (
                    <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                      <div className="empty-state__icon">🏷️</div>
                      <p>No products found. Add products on Gumroad or Printify.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              MERCH TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "merch" && (
            <div className="panel active">
              <div className="section-header">
                <h2>Printify Merch</h2>
                <span>{printify?.totalProducts || 0} products</span>
              </div>
              {/* Status banner */}
              <div className="seed-banner" style={{
                background: printifyError
                  ? "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))"
                  : "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(184,115,51,0.06))",
                borderColor: printifyError ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{printifyError ? "⚠️" : "🔗"}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {printifyError ? "Printify Disconnected" : "Printify Connected"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {printifyError || `${printify?.totalProducts || 0} products synced · Shop ID: 28018533`}
                    </div>
                  </div>
                </div>
                <span className={`badge ${printifyError ? "badge--error" : "badge--fulfilled"}`}>
                  {printifyError ? "● Error" : "● Synced"}
                </span>
              </div>

              {printifyLoading ? (
                <div className="skeleton-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton-card" style={{ height: 240 }} />
                  ))}
                </div>
              ) : (
                <div className="product-grid">
                  {(printify?.products || []).map((p) => (
                    <div key={p.id} className="product-card">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} />
                      ) : (
                        <div style={{
                          width: "100%", height: 140, borderRadius: "var(--radius-sm)",
                          background: "rgba(255,255,255,0.03)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "2.5rem", marginBottom: "0.75rem",
                        }}>👕</div>
                      )}
                      <div className="product-card__name">{p.title}</div>
                      <div className="product-card__meta">
                        <span style={{ color: "var(--accent-copper)", fontWeight: 700, fontSize: "1rem" }}>
                          ${p.minPrice.toFixed(2)}
                        </span>
                        <span style={{ marginLeft: 8 }}>· {p.variants} variants</span>
                      </div>
                      <a
                        href={`https://printify.com/app/products/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-card__link"
                      >
                        Edit on Printify ↗
                      </a>
                    </div>
                  ))}
                  {(printify?.products?.length || 0) === 0 && !printifyError && (
                    <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                      <div className="empty-state__icon">👕</div>
                      <p>No merch products found. Create products on Printify to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick link */}
              <div style={{
                marginTop: "1.5rem", textAlign: "center",
              }}>
                <a
                  href="https://printify.com/app/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="refresh-bar__btn"
                  style={{ textDecoration: "none", display: "inline-block" }}
                >
                  Open Printify Dashboard ↗
                </a>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              ANALYTICS TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <div className="panel active">
              <div className="section-header">
                <h2>Site Analytics</h2>
                <span>Real-time from Firestore</span>
              </div>

              {analyticsLoading ? (
                <div className="skeleton-table" style={{ height: 300 }} />
              ) : analytics.length > 0 ? (
                <>
                  {/* Summary Cards */}
                  <div className="summary-grid">
                    <div className="summary-card">
                      <div className="summary-card__icon">👁️</div>
                      <div className="summary-card__label">Total Page Views</div>
                      <div className="summary-card__value copper">
                        {analytics.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card__icon">👤</div>
                      <div className="summary-card__label">Unique Visitors</div>
                      <div className="summary-card__value blue">
                        {analytics.reduce((sum, a) => sum + (a.visitors || 0), 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card__icon">📄</div>
                      <div className="summary-card__label">Pages Tracked</div>
                      <div className="summary-card__value gold">
                        {new Set(analytics.map((a) => a.page)).size}
                      </div>
                    </div>
                  </div>

                  {/* Top Pages Table */}
                  <div className="section-header" style={{ marginTop: "1.5rem" }}>
                    <h2>Top Pages</h2>
                  </div>
                  <div className="table-wrap">
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Page</th>
                            <th>Views</th>
                            <th>Visitors</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.slice(0, 20).map((a, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 600 }}>{a.page}</td>
                              <td className="amount">{a.views?.toLocaleString()}</td>
                              <td className="amount">{a.visitors?.toLocaleString()}</td>
                              <td style={{ color: "var(--text-muted)" }}>{a.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ padding: "3rem 2rem" }}>
                  <div className="empty-state__icon">📊</div>
                  <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Analytics Not Set Up Yet</h3>
                  <p style={{ maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                    To start tracking analytics, create a Firestore collection called{" "}
                    <code style={{
                      background: "rgba(184,115,51,0.15)", padding: "2px 8px",
                      borderRadius: 4, color: "var(--accent-copper)",
                    }}>analytics</code>{" "}
                    with documents containing:
                  </p>
                  <div style={{
                    marginTop: "1.5rem", textAlign: "left", maxWidth: 400,
                    margin: "1.5rem auto 0", background: "var(--bg-card-alt)",
                    borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem",
                    fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-secondary)",
                  }}>
                    {`{`}<br/>
                    {`  "page": "/",`}<br/>
                    {`  "views": 142,`}<br/>
                    {`  "visitors": 89,`}<br/>
                    {`  "date": "2026-06-23"`}<br/>
                    {`}`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              CLIFF TRACKER TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "cliff" && (
            <div className="panel active">
              <div className="section-header">
                <h2>Think! Ventures Give-Back Model</h2>
                <span>Cliff Progress Tracker</span>
              </div>

              {cliffLoading && !cliffData ? (
                <div className="skeleton-grid">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-card" style={{ height: 160 }} />
                  ))}
                </div>
              ) : (
                <>
                  {/* Overview Cards */}
                  <div className="summary-grid">
                    <div className="summary-card">
                      <div className="summary-card__icon">💰</div>
                      <div className="summary-card__label">Cumulative Revenue</div>
                      <div className="summary-card__value green">{formatCurrency(totalRevenue)}</div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card__icon">📊</div>
                      <div className="summary-card__label">Est. Net Profit</div>
                      <div className="summary-card__value copper">{formatCurrency(netProfit)}</div>
                      <div className="summary-card__note">~{((1 - estimatedExpenseRate) * 100).toFixed(0)}% margin</div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card__icon">🎯</div>
                      <div className="summary-card__label">Cliff Status</div>
                      <div className={`summary-card__value ${cliffReached ? "green" : "gold"}`}>
                        {cliffReached ? "REACHED ✓" : "IN PROGRESS"}
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card__icon">🎓</div>
                      <div className="summary-card__label">Graduation</div>
                      <div className={`summary-card__value ${graduated ? "green" : "blue"}`}>
                        {graduated ? "GRADUATED 🎓" : `${graduationProgress.toFixed(0)}%`}
                      </div>
                      <div className="summary-card__note">${totalContributed.toLocaleString()} / $10,000</div>
                    </div>
                  </div>

                  {/* Phase Breakdown */}
                  <div className="rec-card">
                    <h3>📋 How the Give-Back Model Works</h3>

                    {/* Phase 1 */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: "0.5rem",
                      }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          Phase 1: The Cliff — $0 → $2,500 Net Profit
                        </span>
                        <span className={`badge ${cliffReached ? "badge--fulfilled" : "badge--pending"}`}>
                          {cliffReached ? "Complete" : `${cliffProgress.toFixed(0)}%`}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                        <strong>Keep 100%</strong> of all net profit until you reach $2,500 cumulative.
                        No give-back obligation during this phase.
                      </p>
                      <div className="progress-bar">
                        <div className="progress-bar__fill" style={{ width: `${cliffProgress}%` }} />
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: "0.5rem",
                      }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          Phase 2: Quarterly Give-Back — 10% of Net Profit
                        </span>
                        <span className={`badge ${cliffReached && !graduated ? "badge--in-progress" : cliffReached ? "badge--fulfilled" : "badge--not-started"}`}>
                          {graduated ? "Complete" : cliffReached ? "Active" : "Locked"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        After the cliff, contribute 10% of net profit each quarter to Think! Ventures.
                      </p>
                    </div>

                    {/* Phase 3 */}
                    <div>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: "0.5rem",
                      }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          Phase 3: Graduation — $10,000 Total Contributed
                        </span>
                        <span className={`badge ${graduated ? "badge--fulfilled" : "badge--not-started"}`}>
                          {graduated ? "🎓 Graduated" : "Locked"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                        Once total contributions reach $10,000, you&apos;re fully graduated.
                        No further obligations. Keep 100% forever.
                      </p>
                      <div className="progress-bar">
                        <div className="progress-bar__fill" style={{
                          width: `${graduationProgress}%`,
                          background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
                        }} />
                      </div>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.35rem",
                      }}>
                        <span>${totalContributed.toLocaleString()} contributed</span>
                        <span>$10,000 target</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              SETTINGS TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div className="panel active">
              {/* API Connection Status */}
              <div className="section-header">
                <h2>API Connections</h2>
              </div>
              <div className="table-wrap" style={{ marginBottom: "2rem" }}>
                {[
                  {
                    name: "Gumroad",
                    icon: "🛒",
                    connected: !gumroadError && !!gumroad?.success,
                    detail: gumroadError || `${gumroad?.totalSales || 0} sales · ${gumroad?.products?.length || 0} products`,
                    error: gumroadError,
                  },
                  {
                    name: "Printify",
                    icon: "👕",
                    connected: !printifyError && !!printify?.success,
                    detail: printifyError || `${printify?.totalProducts || 0} products · Shop ID: 28018533`,
                    error: printifyError,
                  },
                  {
                    name: "Firebase",
                    icon: "🔥",
                    connected: true,
                    detail: `Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hood-hymns"}`,
                    error: "",
                  },
                ].map((api, i, arr) => (
                  <div
                    key={api.name}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1rem 1.25rem",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>{api.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{api.name}</div>
                        <div style={{ fontSize: "0.75rem", color: api.error ? "var(--accent-red)" : "var(--text-muted)" }}>
                          {api.detail}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${api.connected ? "badge--fulfilled" : "badge--error"}`}>
                      {api.connected ? "● Connected" : "● Error"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Account Info */}
              <div className="section-header">
                <h2>Account Info</h2>
              </div>
              <div className="table-wrap" style={{ marginBottom: "2rem" }}>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}>
                    {[
                      { label: "Signed in as", value: user.email || "Unknown" },
                      { label: "Display Name", value: user.displayName || "—" },
                      { label: "Role", value: "Admin" },
                      { label: "Auth Provider", value: user.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email" },
                      { label: "Platform", value: "Netlify" },
                      { label: "Framework", value: "Next.js 15" },
                      { label: "Domain", value: "hoodhymns.com" },
                      { label: "Build Status", value: "Active ✅" },
                    ].map((info) => (
                      <div key={info.label} style={{
                        padding: "0.75rem 1rem",
                        background: "var(--bg-card-alt)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}>
                        <div style={{
                          fontSize: "0.65rem", color: "var(--text-muted)",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                          fontWeight: 600, marginBottom: "0.25rem",
                        }}>{info.label}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, wordBreak: "break-all" }}>{info.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="section-header">
                <h2>Quick Links</h2>
              </div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "0.5rem",
              }}>
                {[
                  { label: "Gumroad Dashboard", url: "https://app.gumroad.com/dashboard" },
                  { label: "Printify Dashboard", url: "https://printify.com/app/products" },
                  { label: "Firebase Console", url: `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hood-hymns"}/overview` },
                  { label: "Netlify Deploys", url: "https://app.netlify.com" },
                  { label: "GitHub Repo", url: "https://github.com/ncatlandarch-droid/hood-hymns-publishing" },
                  { label: "Stripe Dashboard", url: "https://dashboard.stripe.com" },
                  { label: "Google Analytics", url: "https://analytics.google.com" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--accent-copper)",
                      border: "1px solid rgba(184,115,51,0.25)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      background: "rgba(184,115,51,0.06)",
                    }}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Error States */}
          {gumroadError && activeTab === "dashboard" && (
            <div className="error-state" style={{ marginTop: "1rem" }}>
              <div className="error-state__icon">⚠️</div>
              <div className="error-state__title">Gumroad Connection Error</div>
              <div className="error-state__msg">{gumroadError}</div>
              <button className="error-state__btn" onClick={fetchGumroad}>Retry</button>
            </div>
          )}
          {printifyError && activeTab === "dashboard" && (
            <div className="error-state" style={{ marginTop: "1rem" }}>
              <div className="error-state__icon">⚠️</div>
              <div className="error-state__title">Printify Connection Error</div>
              <div className="error-state__msg">{printifyError}</div>
              <button className="error-state__btn" onClick={fetchPrintify}>Retry</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════════════════════════
const cssReset = `
  .hh-admin {
    --bg-primary: #0b0f1a;
    --bg-card: #141928;
    --bg-card-alt: #1a2035;
    --bg-hover: #1e2745;
    --border: rgba(255,255,255,0.06);
    --border-focus: rgba(184,115,51,0.4);
    --text-primary: #e8eaf0;
    --text-secondary: #8b95b0;
    --text-muted: #5a6380;
    --accent-copper: #B87333;
    --accent-copper-light: #D4956B;
    --accent-green: #10b981;
    --accent-gold: #f59e0b;
    --accent-red: #ef4444;
    --accent-blue: #3b82f6;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.3);

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
  }

  .hh-admin * { margin: 0; padding: 0; box-sizing: border-box; }

  /* ── Login Gate ── */
  #login-gate {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
  }
  .login-form { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 360px; }
  .login-form input {
    background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary);
    padding: 0.85rem 1.25rem; border-radius: var(--radius); font-size: 1rem; text-align: center;
    outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif;
  }
  .login-form input:focus { border-color: var(--accent-copper); box-shadow: 0 0 0 3px rgba(184,115,51,0.15); }
  .login-form input::placeholder { color: var(--text-muted); }
  .login-btn {
    background: var(--accent-copper);
    color: white; border: none;
    padding: 0.85rem 2.5rem; border-radius: var(--radius);
    font-size: 1rem; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'Inter', sans-serif; width: 100%;
  }
  .login-btn:hover { background: #a0632a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(184,115,51,0.3); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .login-btn--google {
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-primary);
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .login-btn--google:hover { background: var(--bg-hover); border-color: var(--border-focus); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .login-divider { display: flex; align-items: center; gap: 1rem; color: var(--text-muted); font-size: 0.8rem; }
  .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .login-form .error { color: var(--accent-red); font-size: 0.8rem; min-height: 1.2em; text-align: center; }

  /* ── Access Denied ── */
  #access-denied {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
  }
  #access-denied .icon { font-size: 4rem; margin-bottom: 1rem; }
  #access-denied h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  #access-denied p { color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 400px; }

  /* ── Top Bar ── */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-card);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .topbar::before {
    content: ''; position: absolute;
    left: 1.5rem; top: 50%; transform: translateY(-50%);
    width: 60px; height: 60px;
    background: radial-gradient(circle, rgba(184,115,51,0.25) 0%, transparent 70%);
    pointer-events: none; z-index: -1;
  }
  .topbar__left { display: flex; align-items: center; gap: 0.75rem; }
  .topbar__left h1 { font-size: 1.1rem; font-weight: 700; }
  .topbar__badge {
    color: var(--accent-copper); font-size: 0.7rem; font-weight: 700;
    background: rgba(184,115,51,0.15); padding: 0.15rem 0.6rem; border-radius: 50px;
  }
  .topbar__right { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
  .topbar__timer { color: var(--text-muted); font-size: 0.7rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .topbar__avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-copper), #D4944A);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; color: white; flex-shrink: 0;
  }
  .topbar__user { color: var(--text-secondary); font-size: 0.8rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .topbar__logout {
    background: none; border: 1px solid var(--border); color: var(--text-secondary);
    padding: 0.4rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;
    transition: all 0.2s; font-family: 'Inter', sans-serif;
  }
  .topbar__logout:hover { border-color: var(--accent-red); color: var(--accent-red); }

  /* ── Tab Navigation ── */
  .tabs {
    display: flex; gap: 0;
    border-bottom: 1px solid var(--border);
    background: var(--bg-card);
    padding: 0 2rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    padding: 1rem 1.5rem;
    color: var(--text-muted);
    font-size: 0.85rem; font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    user-select: none;
  }
  .tab:hover { color: var(--text-secondary); }
  .tab.active { color: var(--accent-copper); border-bottom-color: var(--accent-copper); }

  /* ── Content ── */
  .content { padding: 2rem; max-width: 1400px; margin: 0 auto; }
  .panel { display: none; animation: fadeIn 0.3s ease; }
  .panel.active { display: block; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Summary Cards ── */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem; margin-bottom: 2rem;
  }
  .summary-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem;
    transition: all 0.25s ease; position: relative; overflow: hidden;
  }
  .summary-card::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-copper), transparent);
    opacity: 0; transition: opacity 0.25s ease;
  }
  .summary-card:hover { border-color: var(--border-focus); transform: translateY(-2px); box-shadow: var(--shadow); }
  .summary-card:hover::after { opacity: 1; }
  .summary-card__icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .summary-card__label { color: var(--text-muted); font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .summary-card__value { font-size: 1.8rem; font-weight: 800; }
  .summary-card__value.green { color: var(--accent-green); }
  .summary-card__value.gold { color: var(--accent-gold); }
  .summary-card__value.copper { color: var(--accent-copper); }
  .summary-card__value.red { color: var(--accent-red); }
  .summary-card__value.blue { color: var(--accent-blue); }
  .summary-card__note { color: var(--text-muted); font-size: 0.7rem; margin-top: 0.35rem; }

  /* ── Section Headers ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .section-header h2 { font-size: 1.15rem; font-weight: 700; }
  .section-header span { color: var(--text-muted); font-size: 0.8rem; }

  /* ── Refresh Bar ── */
  .refresh-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem; padding: 0.75rem 1rem;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
  }
  .refresh-bar__time { color: var(--text-muted); font-size: 0.75rem; }
  .refresh-bar__btn {
    background: rgba(184,115,51,0.15); color: var(--accent-copper);
    border: 1px solid rgba(184,115,51,0.2);
    padding: 0.4rem 1rem; border-radius: var(--radius-sm);
    cursor: pointer; font-size: 0.75rem; font-weight: 600;
    font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .refresh-bar__btn:hover { background: rgba(184,115,51,0.25); border-color: var(--accent-copper); }
  .refresh-bar__btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Tables ── */
  .table-wrap {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; margin-bottom: 2rem;
  }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left; padding: 0.85rem 1rem;
    font-size: 0.7rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--text-muted); background: var(--bg-card-alt);
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  tbody td { padding: 0.85rem 1rem; font-size: 0.85rem; border-bottom: 1px solid var(--border); }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr { transition: background 0.15s ease; }
  tbody tr:hover { background: var(--bg-hover); }
  .amount { font-weight: 600; font-variant-numeric: tabular-nums; }
  .amount.positive { color: var(--accent-green); }

  /* ── Badges ── */
  .badge {
    display: inline-block; padding: 0.2rem 0.6rem;
    border-radius: 50px; font-size: 0.7rem;
    font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em; white-space: nowrap;
  }
  .badge--fulfilled { background: rgba(16,185,129,0.15); color: var(--accent-green); }
  .badge--shipped { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
  .badge--pending { background: rgba(245,158,11,0.15); color: var(--accent-gold); }
  .badge--refunded { background: rgba(239,68,68,0.15); color: var(--accent-red); }
  .badge--error { background: rgba(239,68,68,0.15); color: var(--accent-red); }
  .badge--gumroad { background: rgba(255,144,232,0.12); color: #ff90e8; }
  .badge--printify { background: rgba(59,130,246,0.12); color: var(--accent-blue); }
  .badge--in-progress { background: rgba(59,130,246,0.15); color: var(--accent-blue); }
  .badge--not-started { background: rgba(90,99,128,0.2); color: var(--text-muted); }

  /* ── Progress Bars ── */
  .progress-bar {
    background: var(--bg-card-alt); border-radius: 50px;
    height: 8px; width: 100%; overflow: hidden;
  }
  .progress-bar__fill {
    height: 100%; border-radius: 50px;
    background: linear-gradient(90deg, var(--accent-copper), var(--accent-copper-light));
    transition: width 0.6s ease;
  }

  /* ── Product Grid ── */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem; margin-bottom: 2rem;
  }
  .product-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1rem;
    transition: all 0.25s ease; text-align: center;
  }
  .product-card:hover { border-color: var(--border-focus); transform: translateY(-2px); box-shadow: var(--shadow); }
  .product-card img {
    width: 100%; max-width: 140px; height: 140px;
    object-fit: contain; border-radius: var(--radius-sm);
    margin-bottom: 0.75rem; background: rgba(255,255,255,0.03);
  }
  .product-card__name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem; }
  .product-card__meta { color: var(--text-muted); font-size: 0.7rem; }
  .product-card__link {
    display: inline-block; margin-top: 0.5rem;
    font-size: 0.7rem; color: var(--accent-copper);
    text-decoration: none; transition: color 0.2s;
  }
  .product-card__link:hover { color: var(--accent-copper-light); text-decoration: underline; }

  /* ── Recommendation Card (Cliff) ── */
  .rec-card {
    background: linear-gradient(135deg, rgba(184,115,51,0.1), rgba(59,130,246,0.1));
    border: 1px solid var(--border-focus);
    border-radius: var(--radius); padding: 1.5rem;
    margin-top: 2rem;
  }
  .rec-card h3 { font-size: 1rem; margin-bottom: 0.75rem; color: var(--accent-copper-light); }
  .rec-card p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6; margin-bottom: 0.75rem; }

  /* ── Skeleton Loader ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem; margin-bottom: 2rem;
  }
  .skeleton-card {
    height: 110px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); position: relative; overflow: hidden;
  }
  .skeleton-card::after {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(184,115,51,0.06), transparent);
    animation: shimmer 1.8s infinite;
  }
  .skeleton-table {
    height: 200px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); position: relative; overflow: hidden;
    margin-bottom: 2rem;
  }
  .skeleton-table::after {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(184,115,51,0.06), transparent);
    animation: shimmer 1.8s infinite;
  }
  @keyframes shimmer { to { left: 100%; } }

  /* ── Empty State ── */
  .empty-state { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; }
  .empty-state__icon { font-size: 2rem; margin-bottom: 0.75rem; }

  /* ── Error State ── */
  .error-state {
    text-align: center; padding: 2rem;
    background: var(--bg-card); border: 1px solid rgba(239,68,68,0.2);
    border-radius: var(--radius); margin-bottom: 2rem;
  }
  .error-state__icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .error-state__title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
  .error-state__msg { color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 1rem; }
  .error-state__btn {
    background: var(--accent-red); color: #fff; border: none;
    padding: 0.5rem 1.25rem; border-radius: var(--radius-sm);
    cursor: pointer; font-size: 0.8rem; font-weight: 600;
    font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .error-state__btn:hover { background: #dc2626; transform: translateY(-1px); }

  /* ── Seed Banner ── */
  .seed-banner {
    background: linear-gradient(135deg, rgba(184,115,51,0.1), rgba(59,130,246,0.1));
    border: 1px solid var(--border-focus);
    border-radius: var(--radius); padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
  }

  /* ── Spinner ── */
  .spinner {
    border: 3px solid var(--border);
    border-top-color: var(--accent-copper);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
    .topbar__right { gap: 0.5rem; }
    .topbar__user { display: none; }
    .topbar__left h1 { font-size: 0.9rem; }
    .tabs { padding: 0 0.5rem; }
    .tab { padding: 0.75rem 1rem; font-size: 0.8rem; }
    .content { padding: 1rem; }
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
    .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
    .product-grid { grid-template-columns: repeat(2, 1fr); }
    table { font-size: 0.8rem; }
    thead th, tbody td { padding: 0.6rem 0.5rem; }
    .refresh-bar { flex-direction: column; gap: 0.5rem; text-align: center; }
  }
  @media (max-width: 480px) {
    .summary-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    .summary-card { padding: 1rem; }
    .summary-card__value { font-size: 1.4rem; }
    .product-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  }
`;
