"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type UserData = {
  id: string;
  username: string;
  department: string;
  role: "USER" | "ADMIN";
};

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);

  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA USER
  // =========================
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${id}`);

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "User tidak ditemukan.");
          return;
        }

        setUser(data.user);

        setUsername(data.user.username);
        setDepartment(data.user.department);
        setRole(data.user.role);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data user.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  // =========================
  // SIMPAN PERUBAHAN
  // =========================
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    if (!username.trim() || !department.trim()) {
      setError("Username dan department wajib diisi.");
      setSaving(false);
      return;
    }

    if (password && password.length < 6) {
      setError("Password minimal 6 karakter.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          department,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal memperbarui user.");
        return;
      }

      router.push("/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat memperbarui user.");
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm text-slate-500">
            Memuat data user...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR / USER TIDAK ADA
  // =========================
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            User tidak ditemukan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Data user tidak tersedia."}
          </p>

          <Link
            href="/users"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Kembali ke User
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/users"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Kembali ke User
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Edit User
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Perbarui informasi pengguna.
            </p>
          </div>
        </div>
      </header>

      {/* FORM */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                {username.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Informasi User
                </h2>

                <p className="text-sm text-slate-500">
                  ID: {user.id}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-6">
              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* USERNAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Masukkan username"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <input
                  type="text"
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  placeholder="Contoh: IT, HR, Finance"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password Baru
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Kosongkan jika password tidak ingin diubah.
                </p>
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as "USER" | "ADMIN"
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="USER">
                    User
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Link
                href="/users"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
