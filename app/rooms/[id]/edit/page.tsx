"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type RoomData = {
  id: string;
  name: string;
  location: string | null;
  capacity: number | null;
  isActive: boolean;
};

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [room, setRoom] = useState<RoomData | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA ROOM
  // =========================

  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await fetch(`/api/rooms/${id}`);

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Ruangan tidak ditemukan.");
          return;
        }

        setRoom(data.room);

        setName(data.room.name);
        setLocation(data.room.location || "");
        setCapacity(
          data.room.capacity !== null
            ? String(data.room.capacity)
            : ""
        );
        setIsActive(data.room.isActive);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data ruangan.");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [id]);

  // =========================
  // SIMPAN PERUBAHAN
  // =========================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    if (!name.trim()) {
      setError("Nama ruangan wajib diisi.");
      setSaving(false);
      return;
    }

    if (
      capacity !== "" &&
      (!Number.isInteger(Number(capacity)) ||
        Number(capacity) < 1)
    ) {
      setError("Kapasitas harus berupa angka minimal 1.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          capacity,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Gagal memperbarui ruangan."
        );
        return;
      }

      router.push("/rooms");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(
        "Terjadi kesalahan saat memperbarui ruangan."
      );
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
            Memuat data ruangan...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ROOM TIDAK DITEMUKAN
  // =========================

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Ruangan tidak ditemukan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Data ruangan tidak tersedia."}
          </p>

          <Link
            href="/rooms"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Kembali ke Ruangan
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link
            href="/rooms"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Kembali ke Ruangan
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Edit Ruangan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Perbarui informasi ruangan.
          </p>
        </div>
      </header>

      {/* FORM */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* CARD HEADER */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                🏢
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Informasi Ruangan
                </h2>

                <p className="text-sm text-slate-500">
                  ID: {room.id}
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

              {/* NAMA */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Ruangan
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Contoh: Ruang Rapat Utama"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              {/* LOKASI */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Lokasi
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Contoh: Lantai 2"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* KAPASITAS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kapasitas
                </label>

                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(event) =>
                    setCapacity(event.target.value)
                  }
                  placeholder="Contoh: 20"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Masukkan jumlah maksimal orang yang dapat
                  menggunakan ruangan.
                </p>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Status Ruangan
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) =>
                      setIsActive(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Ruangan Aktif
                    </p>

                    <p className="text-xs text-slate-500">
                      Ruangan dapat digunakan untuk booking.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Link
                href="/rooms"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
