import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getNavigationForRole, ROLE_METADATA } from "@/lib/permissions";
import {
  logoutAction,
  quickSwitchRoleAction,
} from "@/app/actions/auth-actions";
import type { Role } from "@prisma/client";

const QUICK_SWITCH_ROLES: Array<{ role: Role; email: string; short: string }> = [
  { role: "PENGGUNA", email: "warga@greenpark.id", short: "1. Pengguna" },
  {
    role: "PENGELOLA",
    email: "pengelola.bgv@greenpark.id",
    short: "2. Pengelola",
  },
  { role: "MANAGER", email: "manager@greenpark.id", short: "3. Manager" },
  { role: "PIC_VENDOR", email: "pic@vendorjaya.id", short: "4. PIC Vendor" },
  {
    role: "TEKNISI",
    email: "teknisi.budi@vendorjaya.id",
    short: "5. Teknisi",
  },
  { role: "ADMIN", email: "admin@greenpark.id", short: "6. Admin" },
  { role: "OWNER", email: "owner@greenpark.id", short: "7. Owner" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const navItems = getNavigationForRole(session.role);
  const roleMeta = ROLE_METADATA[session.role];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Bar Penguji Fase 0: Pindah Role Cepat */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Mode Uji Fase 0
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Ganti role instan untuk mengecek perbedaan menu & hak akses:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_SWITCH_ROLES.map((r) => {
              const isCurrent =
                session.email.toLowerCase() === r.email.toLowerCase();
              return (
                <form
                  key={r.email}
                  action={quickSwitchRoleAction.bind(null, r.email)}
                >
                  <button
                    type="submit"
                    className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                      isCurrent
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {r.short}
                  </button>
                </form>
              );
            })}
            <form
              action={quickSwitchRoleAction.bind(null, "admin@griyaasri.id")}
            >
              <button
                type="submit"
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  session.email === "admin@griyaasri.id"
                    ? "bg-amber-400 text-slate-950 font-bold"
                    : "bg-slate-800 text-amber-300 hover:bg-slate-700"
                }`}
              >
                Perusahaan B
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Header Utama */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-bold text-lg text-slate-900"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-extrabold">
                GP
              </span>
              <span>GreenPark</span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              {session.companyName || "Lintas Aset"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900 flex items-center justify-end gap-2">
                <span>{session.name}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${roleMeta.badgeColor}`}
                >
                  {session.role}
                </span>
              </div>
              <div className="text-xs text-slate-500">{session.email}</div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-medium text-slate-700 transition cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Konten Utama + Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6">
        <aside className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Menu Role: {session.role}
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Cakupan: <strong>{roleMeta.scopeDescription}</strong>
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 transition group border border-transparent hover:border-emerald-200"
                >
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {item.description}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 text-xs space-y-2">
            <div className="font-bold text-emerald-300 uppercase tracking-wider">
              Tugas Utama Role Ini
            </div>
            <p className="leading-relaxed text-emerald-100/90">
              {roleMeta.mainDuties}
            </p>
            <div className="pt-2 border-t border-emerald-800/70 text-emerald-300/80">
              Dibuat oleh: <strong>{roleMeta.createdBy}</strong>
            </div>
          </div>
        </aside>

        <main className="md:col-span-9 space-y-6">{children}</main>
      </div>
    </div>
  );
}

