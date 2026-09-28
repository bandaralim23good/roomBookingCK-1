"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
};

type DaySchedule = {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  label: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const defaultSchedules: DaySchedule[] = [
  {
    dayOfWeek: "MONDAY",
    label: "Senin",
    startTime: "08:00",
    endTime: "17:00",
    isActive: true,
  },
  {
    dayOfWeek: "TUESDAY",
    label: "Selasa",
    startTime: "08:00",
    endTime: "17:00",
    isActive: true,
  },
  {
    dayOfWeek: "WEDNESDAY",
    label: "Rabu",
    startTime: "08:00",
    endTime: "17:00",
    isActive: true,
  },
  {
    dayOfWeek: "THURSDAY",
    label: "Kamis",
    startTime: "08:00",
    endTime: "17:00",
    isActive: true,
  },
  {
    dayOfWeek: "FRIDAY",
    label: "Jumat",
    startTime: "08:00",
    endTime: "16:00",
    isActive: true,
  },
  {
    dayOfWeek: "SATURDAY",
    label: "Sabtu",
    startTime: "08:00",
    endTime: "12:00",
    isActive: false,
  },
  {
    dayOfWeek: "SUNDAY",
    label: "Minggu",
    startTime: "08:00",
    endTime: "12:00",
    isActive: false,
  },
];

export default function RoomSchedulePage() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [schedules, setSchedules] =
    useState<DaySchedule[]>(defaultSchedules);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const response = await fetch("/api/rooms");

      if (!response.ok) {
        throw new Error("Gagal mengambil data ruangan.");
      }

      const data = await response.json();

      setRooms(data.rooms || []);

      if (data.rooms?.length > 0) {
        setRoomId(data.rooms[0].id);
      }
    } catch (error) {
      console.error(error);
      setError("Gagal mengambil data ruangan.");
    } finally {
      setLoadingRooms(false);
    }
  }

  useEffect(() => {
    if (!roomId) return;

    loadSchedule(roomId);
  }, [roomId]);

  async function loadSchedule(selectedRoomId: string) {
    setLoadingSchedule(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/room-schedules?roomId=${selectedRoomId}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil jadwal.");
      }

      const data = await response.json();

      const savedSchedules = data.schedules || [];

      setSchedules(
        defaultSchedules.map((defaultDay) => {
          const saved = savedSchedules.find(
            (item: any) =>
              item.dayOfWeek === defaultDay.dayOfWeek
          );

          if (!saved) {
            return defaultDay;
          }

          return {
            ...defaultDay,
            startTime: saved.startTime,
            endTime: saved.endTime,
            isActive: saved.isActive,
          };
        })
      );
    } catch (error) {
      console.error(error);
      setError("Gagal mengambil jadwal ruangan.");
    } finally {
      setLoadingSchedule(false);
    }
  }

  function updateSchedule(
    index: number,
    field: "startTime" | "endTime" | "isActive",
    value: string | boolean
  ) {
    setSchedules((current) =>
      current.map((schedule, i) =>
        i === index
          ? {
              ...schedule,
              [field]: value,
            }
          : schedule
      )
    );
  }

  async function handleSave() {
    setError("");
    setMessage("");

    if (!roomId) {
      setError("Silakan pilih ruangan.");
      return;
    }

    for (const schedule of schedules) {
      if (!schedule.isActive) continue;

      if (!schedule.startTime || !schedule.endTime) {
        setError(
          `Jam ${schedule.label} belum lengkap.`
        );
        return;
      }

      if (schedule.startTime >= schedule.endTime) {
        setError(
          `Jam mulai ${schedule.label} harus lebih kecil dari jam selesai.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch("/api/room-schedules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          schedules: schedules.map((schedule) => ({
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isActive: schedule.isActive,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Gagal menyimpan jadwal."
        );
        return;
      }

      setMessage(
        data.message || "Jadwal berhasil disimpan."
      );
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menyimpan jadwal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/rooms")}
            className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            ← Kembali ke Ruangan
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Jadwal Ruangan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Atur hari dan jam penggunaan untuk setiap ruangan.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Room Selector */}
          <div className="border-b border-slate-200 p-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Pilih Ruangan
            </label>

            {loadingRooms ? (
              <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
            ) : rooms.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Belum ada ruangan yang tersedia.
              </div>
            ) : (
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Schedule */}
          <div className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Jam Penggunaan
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Aktifkan hari yang dapat digunakan untuk booking.
              </p>
            </div>

            {loadingSchedule ? (
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Hari
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Jam Mulai
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Jam Selesai
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {schedules.map((schedule, index) => (
                      <tr
                        key={schedule.dayOfWeek}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800">
                            {schedule.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <input
                            type="time"
                            value={schedule.startTime}
                            disabled={!schedule.isActive}
                            onChange={(e) =>
                              updateSchedule(
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <input
                            type="time"
                            value={schedule.endTime}
                            disabled={!schedule.isActive}
                            onChange={(e) =>
                              updateSchedule(
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <label className="inline-flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={schedule.isActive}
                              onChange={(e) =>
                                updateSchedule(
                                  index,
                                  "isActive",
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                            <span
                              className={`text-sm font-medium ${
                                schedule.isActive
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {schedule.isActive
                                ? "Aktif"
                                : "Tutup"}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Feedback */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {/* Save */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  loadingRooms ||
                  loadingSchedule ||
                  rooms.length === 0
                }
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Jadwal"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}