"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (!department.trim()) {
      setError("Department wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          department: department.trim(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menambahkan user.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menambahkan user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-2xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              R
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                RoomBook
              </h1>

              <p className="text-xs text-slate-400">
                User Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* TITLE */}
        <div className="mb-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
            ♙
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Tambah User
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Buat akun pengguna baru untuk mengakses sistem
            booking ruangan.
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin01"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Username digunakan untuk login ke sistem.
              </p>
            </div>

            {/* DEPARTMENT */}
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department
              </label>

              <input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Contoh: Produksi"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Password akan disimpan dalam bentuk terenkripsi.
              </p>
            </div>

            {/* ROLE */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Role
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "USER" | "ADMIN")
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Administrator</option>
              </select>

              <p className="mt-2 text-xs text-slate-400">
                Administrator memiliki akses pengelolaan sistem.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <span className="font-bold">!</span>

                <p>{error}</p>
              </div>
            )}

            {/* BUTTON */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Tambah User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
