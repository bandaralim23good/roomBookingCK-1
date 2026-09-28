"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Username atau password yang Anda masukkan salah.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-indigo-600 lg:flex">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* BRAND */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-indigo-600 shadow-lg">
                SR
              </div>

              <div>
                <p className="font-bold text-white">
                  Sewa Ruang
                </p>

                <p className="text-xs text-indigo-200">
                  Room Booking System
                </p>
              </div>
            </Link>

            {/* CONTENT */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-50 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Sistem Booking Ruangan
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Kelola dan booking ruangan dengan lebih mudah.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100">
                Akses jadwal ruangan, lakukan booking, dan lihat penggunaan
                ruangan dalam satu sistem yang terorganisir.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">
                    Jadwal Ruangan
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-200">
                    Lihat penggunaan ruangan berdasarkan tanggal.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">
                    Booking Mudah
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-200">
                    Tentukan ruangan dan waktu sesuai kebutuhan.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-indigo-200">
              © {new Date().getFullYear()} Sewa Ruang
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="mb-10 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
                  SR
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Sewa Ruang
                  </p>

                  <p className="text-xs text-slate-400">
                    Room Booking System
                  </p>
                </div>
              </Link>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-indigo-600">
                Selamat datang kembali
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Masuk ke akun Anda
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Silakan masukkan username dan password untuk mengakses sistem
                booking ruangan.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"
            >
              <div className="space-y-5">

                {/* USERNAME */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="10"
                          rx="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <span className="font-bold">!</span>

                    <p>{error}</p>
                  </div>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Memproses...
                    </span>
                  ) : (
                    "Masuk ke Sistem"
                  )}
                </button>
              </div>
            </form>

            {/* BACK */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-slate-400 transition hover:text-indigo-600"
              >
                ← Kembali ke halaman utama
              </Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
