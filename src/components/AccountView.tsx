"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/PasswordField";
import { readCustomerSession, saveCustomerSession } from "@/lib/customerSession";
import { Skeleton } from "@/components/Skeleton";

type OrderItem = { name: string; quantity: number; price: number; size?: string };
type AccountOrder = {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
};

const statusLabel: Record<string, string> = {
  pending: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function AccountView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameMessage, setNameMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const session = readCustomerSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setName(session.name);
    setEmail(session.email);
    fetch("/api/account", { headers: { Authorization: `Bearer ${session.token}` } })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders ?? []);
          if (data.user?.name) setName(data.user.name);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function saveName(event: React.FormEvent) {
    event.preventDefault();
    const session = readCustomerSession();
    if (!session) return;
    setNameError("");
    setNameMessage("");
    setSavingName(true);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNameError(data.error || "Could not update your name.");
        return;
      }
      saveCustomerSession({ ...session, name: data.user.name });
      setNameMessage("Name updated.");
    } catch {
      setNameError("Could not update your name.");
    } finally {
      setSavingName(false);
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    const session = readCustomerSession();
    if (!session) return;
    setPasswordError("");
    setPasswordMessage("");
    setSavingPassword(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPasswordError(data.error || "Could not update the password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password updated.");
    } catch {
      setPasswordError("Could not update the password.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8" aria-busy="true" aria-label="Loading your account">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-4 w-56 rounded" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-2">Your account</p>
        <h1 className="section-heading text-3xl md:text-4xl font-semibold">Profile</h1>
        <p className="text-sm text-[var(--muted)] mt-2">{email}</p>
      </div>

      <section className="card-warm p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-4">Name</h2>
        <form className="space-y-4" onSubmit={saveName}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full name</label>
            <input id="name" className="input-warm" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          {nameError ? <p className="text-sm text-red-700">{nameError}</p> : null}
          {nameMessage ? <p className="text-sm text-[var(--foreground)]">{nameMessage}</p> : null}
          <button type="submit" className="btn-primary" disabled={savingName}>
            {savingName ? "Saving…" : "Save name"}
          </button>
        </form>
      </section>

      <section className="card-warm p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-4">Password</h2>
        <form className="space-y-4" onSubmit={savePassword}>
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium mb-1.5">Current password</label>
            <PasswordField
              id="current-password"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-1.5">New password</label>
            <PasswordField
              id="new-password"
              name="newPassword"
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={setNewPassword}
            />
          </div>
          {passwordError ? <p className="text-sm text-red-700">{passwordError}</p> : null}
          {passwordMessage ? <p className="text-sm text-[var(--foreground)]">{passwordMessage}</p> : null}
          <button type="submit" className="btn-primary" disabled={savingPassword}>
            {savingPassword ? "Saving…" : "Change password"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Order history</h2>
        {orders.length === 0 ? (
          <div className="card-warm p-8 text-center">
            <p className="text-sm text-[var(--muted)]">You have not placed an order yet.</p>
            <Link href="/" className="inline-block mt-4 text-sm font-medium text-[var(--accent)]">Continue shopping</Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="card-warm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {order.orderItems.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Rs. {Number(order.total).toLocaleString()}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-[#4a142a]">
                      {statusLabel[order.status] ?? order.status}
                    </p>
                  </div>
                </div>
                <Link href={`/order/${order._id}`} className="inline-block mt-3 text-sm font-medium text-[var(--accent)]">
                  Track order
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
