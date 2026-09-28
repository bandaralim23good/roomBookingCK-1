"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteRoomButton from "../DeleteRoomButton";
export default function NewRoomPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Nama ruangan wajib diisi.");
      return;
    }

    if (capacity && Number(capacity) < 1) {
      setError("Kapasitas harus lebih dari 0.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
          capacity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menambahkan ruangan.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menambahkan ruangan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              R
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                RoomBook
              </h1>

              <p className="text-xs text-slate-400">
                Room Management
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
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
            ▦
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Tambah Ruangan
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tambahkan ruangan baru yang nantinya dapat digunakan
            untuk proses booking.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nama Ruangan
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ruang Meeting A"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Lokasi
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lantai 2"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* CAPACITY */}
            <div>
              <label
                htmlFor="capacity"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Kapasitas
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Opsional
                </span>
              </label>

              <div className="relative">
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Contoh: 20"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  orang
                </span>
              </div>
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
                {loading ? "Menyimpan..." : "Tambah Ruangan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
