"use client";

import { useEffect, useMemo, useState } from "react";

type Room = {
  id: string;
  name: string;
};

type Schedule = {
  id: string;
  roomId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type Booking = {
  id: string;
  bookingCode: string;
  startTime: string;
  endTime: string;
  bookerName: string;
  department: string;
  description: string | null;
};

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Minggu",
  MONDAY: "Senin",
  TUESDAY: "Selasa",
  WEDNESDAY: "Rabu",
  THURSDAY: "Kamis",
  FRIDAY: "Jumat",
  SATURDAY: "Sabtu",
};

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function changeDate(dateString: string, amount: number) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() + amount);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

export default function SchedulePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");

  const [date, setDate] = useState(getTodayString());

  const [schedule, setSchedule] =
    useState<Schedule | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingSchedule, setLoadingSchedule] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD ROOMS
  // =====================================================

  useEffect(() => {
    async function loadRooms() {
      try {
        setLoadingRooms(true);
        setError("");

        const response = await fetch("/api/rooms");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Gagal mengambil data ruangan."
          );
        }

        setRooms(data.rooms || []);

        if (data.rooms?.length > 0) {
          setRoomId(data.rooms[0].id);
        }
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data ruangan."
        );
      } finally {
        setLoadingRooms(false);
      }
    }

    loadRooms();
  }, []);

  // =====================================================
  // LOAD SCHEDULE + BOOKINGS
  // =====================================================

  useEffect(() => {
    if (!roomId || !date) {
      return;
    }

    async function loadSchedule() {
      try {
        setLoadingSchedule(true);
        setError("");

        setSchedule(null);
        setBookings([]);

        const selectedDate = new Date(
          `${date}T00:00:00.000Z`
        );

        const dayIndex = selectedDate.getUTCDay();
        const dayOfWeek = DAYS[dayIndex];

        // -----------------------------------------------
        // Ambil jadwal operasional
        // -----------------------------------------------

        const scheduleResponse = await fetch(
          `/api/room-schedules?roomId=${roomId}`
        );

        const scheduleData =
          await scheduleResponse.json();

        if (!scheduleResponse.ok) {
          throw new Error(
            scheduleData.error ||
              "Gagal mengambil jadwal ruangan."
          );
        }

        const currentSchedule =
          scheduleData.schedules?.find(
            (item: Schedule) =>
              item.dayOfWeek === dayOfWeek &&
              item.isActive
          );

        setSchedule(currentSchedule || null);

        // -----------------------------------------------
        // Ambil booking
        // -----------------------------------------------

        const bookingResponse = await fetch(
          `/api/bookings?roomId=${roomId}&date=${date}`
        );

        const bookingData =
          await bookingResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(
            bookingData.error ||
              "Gagal mengambil data booking."
          );
        }

        setBookings(bookingData.bookings || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil jadwal."
        );
      } finally {
        setLoadingSchedule(false);
      }
    }

    loadSchedule();
  }, [roomId, date]);

  // =====================================================
  // SELECTED DAY
  // =====================================================

  const selectedDay = useMemo(() => {
    if (!date) {
      return "";
    }

    const selectedDate = new Date(
      `${date}T00:00:00.000Z`
    );

    return DAYS[selectedDate.getUTCDay()];
  }, [date]);

  // =====================================================
  // NAVIGATION DATE
  // =====================================================

  function goPreviousDay() {
    setDate((current) => changeDate(current, -1));
  }

  function goNextDay() {
    setDate((current) => changeDate(current, 1));
  }

  function goToday() {
    setDate(getTodayString());
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            ROOM SCHEDULE
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Lihat Jadwal Ruangan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lihat jadwal penggunaan ruangan berdasarkan
            tanggal dan ruangan.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FILTER */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

            {/* ROOM */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ruangan
              </label>

              <select
                value={roomId}
                onChange={(e) =>
                  setRoomId(e.target.value)
                }
                disabled={loadingRooms}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  {loadingRooms
                    ? "Memuat ruangan..."
                    : "Pilih ruangan"}
                </option>

                {rooms.map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                  >
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Pilih Tanggal
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>
        </section>

        {/* DATE NAVIGATION */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={goPreviousDay}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Sebelumnya
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600">
                {DAY_LABELS[selectedDay]}
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {formatDate(date)}
              </h2>

              {date === getTodayString() && (
                <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Hari Ini
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToday}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Hari Ini
              </button>

              <button
                type="button"
                onClick={goNextDay}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Berikutnya →
              </button>
            </div>

          </div>
        </section>

        {/* MAIN SCHEDULE */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* SCHEDULE HEADER */}
          <div className="border-b border-slate-200 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Jadwal Penggunaan
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {rooms.find(
                    (room) => room.id === roomId
                  )?.name || "Ruangan"}
                </h2>
              </div>

              {schedule && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-xs font-medium text-blue-600">
                    JAM OPERASIONAL
                  </p>

                  <p className="mt-1 text-sm font-bold text-blue-900">
                    {schedule.startTime} –{" "}
                    {schedule.endTime}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* LOADING */}
          {loadingSchedule && (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500">
                Memuat jadwal...
              </p>
            </div>
          )}

          {/* NO SCHEDULE */}
          {!loadingSchedule && !schedule && (
            <div className="p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
                !
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-800">
                Tidak ada jadwal operasional
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Ruangan ini tidak memiliki jadwal
                operasional pada{" "}
                {DAY_LABELS[selectedDay]}.
              </p>

            </div>
          )}

          {/* EMPTY BOOKING */}
          {!loadingSchedule &&
            schedule &&
            bookings.length === 0 && (
              <div className="p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
                  ✓
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                  Belum ada booking
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Ruangan masih tersedia pada tanggal
                  ini.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Jam operasional{" "}
                  {schedule.startTime} –{" "}
                  {schedule.endTime}
                </p>

              </div>
            )}

          {/* BOOKINGS */}
          {!loadingSchedule &&
            schedule &&
            bookings.length > 0 && (
              <div className="p-6">

                <div className="space-y-4">

                  {bookings.map((booking, index) => {

                    const startMinutes =
                      timeToMinutes(
                        booking.startTime
                      );

                    const endMinutes =
                      timeToMinutes(
                        booking.endTime
                      );

                    const duration =
                      endMinutes - startMinutes;

                    const durationHours =
                      Math.floor(
                        duration / 60
                      );

                    const durationMinutes =
                      duration % 60;

                    let durationText = "";

                    if (durationHours > 0) {
                      durationText += `${durationHours} jam`;
                    }

                    if (durationMinutes > 0) {
                      durationText +=
                        durationText
                          ? ` ${durationMinutes} menit`
                          : `${durationMinutes} menit`;
                    }

                    return (
                      <div
                        key={booking.id}
                        className="relative rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                      >

                        {/* TIMELINE LINE */}
                        {index <
                          bookings.length - 1 && (
                          <div className="absolute bottom-[-17px] left-[27px] top-[65px] hidden w-px bg-slate-200 sm:block" />
                        )}

                        <div className="flex gap-4">

                          {/* TIME */}
                          <div className="w-24 shrink-0">

                            <p className="text-sm font-bold text-blue-600">
                              {booking.startTime}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              sampai
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {booking.endTime}
                            </p>

                          </div>

                          {/* DOT */}
                          <div className="relative hidden sm:block">
                            <div className="mt-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                          </div>

                          {/* CONTENT */}
                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                              <div>
                                <h3 className="text-base font-bold text-slate-900">
                                  {booking.bookerName}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                  {booking.department}
                                </p>
                              </div>

                              <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                                Terisi
                              </span>

                            </div>

                            {booking.description && (
                              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                                <p className="text-xs font-medium text-slate-400">
                                  Keperluan
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  {booking.description}
                                </p>
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">

                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                Durasi:{" "}
                                {durationText}
                              </span>

                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                Kode:{" "}
                                {booking.bookingCode}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>
            )}

        </section>

      </div>
    </main>
  );
}
