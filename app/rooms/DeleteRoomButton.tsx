"use client";

import { useState } from "react";

type DeleteRoomButtonProps = {
  roomId: string;
  roomName: string;
};

export default function DeleteRoomButton({
  roomId,
  roomName,
}: DeleteRoomButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menghapus ruangan.");
        return;
      }

      // Refresh daftar ruangan
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menghapus ruangan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Tombol Hapus */}
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Hapus
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Content */}
            <div className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                🗑️
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Hapus Ruangan?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apakah Anda yakin ingin menghapus ruangan{" "}
                <span className="font-semibold text-slate-800">
                  {roomName}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-red-500">
                Data ruangan yang sudah dihapus tidak dapat
                dikembalikan.
              </p>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
