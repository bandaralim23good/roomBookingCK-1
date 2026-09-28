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

type CurrentUser = {
    id: string;
    username: string;
    department: string;
    role: string;
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

export default function BookingPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomId, setRoomId] = useState("");

    const [date, setDate] = useState(getTodayString());

    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [bookerName, setBookerName] = useState("");
    const [description, setDescription] = useState("");

    // =====================================================
    // CURRENT USER
    // =====================================================

    const [currentUser, setCurrentUser] =
        useState<CurrentUser | null>(null);

    const [loadingUser, setLoadingUser] = useState(true);

    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD CURRENT USER
    // =====================================================

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                setLoadingUser(true);

                const response = await fetch("/api/auth/session");

                if (!response.ok) {
                    throw new Error("Gagal mengambil data pengguna.");
                }

                const data = await response.json();

                if (!data?.user) {
                    throw new Error(
                        "Session pengguna tidak ditemukan. Silakan login kembali."
                    );
                }

                setCurrentUser({
                    id: data.user.id,
                    username: data.user.username,
                    department: data.user.department,
                    role: data.user.role,
                });
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil data pengguna."
                );
            } finally {
                setLoadingUser(false);
            }
        }

        loadCurrentUser();
    }, []);

    // =====================================================
    // LOAD ROOMS
    // =====================================================

    useEffect(() => {
        async function loadRooms() {
            try {
                setLoadingRooms(true);

                const response = await fetch("/api/rooms");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Gagal mengambil ruangan."
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

        async function loadAvailability() {
            try {
                setLoadingSchedule(true);
                setError("");
                setSuccess("");

                setSchedule(null);
                setBookings([]);

                const selectedDate = new Date(
                    `${date}T00:00:00.000Z`
                );

                const dayIndex = selectedDate.getUTCDay();
                const dayOfWeek = DAYS[dayIndex];

                // -----------------------------
                // Ambil jadwal ruangan
                // -----------------------------

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

                // -----------------------------
                // Ambil booking
                // -----------------------------

                const bookingResponse = await fetch(
                    `/api/bookings?roomId=${roomId}&date=${date}`
                );

                const bookingData =
                    await bookingResponse.json();

                if (!bookingResponse.ok) {
                    throw new Error(
                        bookingData.error ||
                        "Gagal mengambil booking."
                    );
                }

                setBookings(bookingData.bookings || []);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil ketersediaan ruangan."
                );
            } finally {
                setLoadingSchedule(false);
            }
        }

        loadAvailability();
    }, [roomId, date]);

    // =====================================================
    // CHECK TIME OVERLAP FOR FRONTEND
    // =====================================================

    const isTimeAvailable = useMemo(() => {
        if (!startTime || !endTime) {
            return true;
        }

        return !bookings.some((booking) => {
            return (
                booking.startTime < endTime &&
                booking.endTime > startTime
            );
        });
    }, [startTime, endTime, bookings]);

    // =====================================================
    // SUBMIT BOOKING
    // =====================================================

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!currentUser) {
            setError(
                "Data pengguna belum tersedia. Silakan refresh halaman."
            );
            return;
        }

        if (!roomId) {
            setError("Silakan pilih ruangan.");
            return;
        }

        if (!date) {
            setError("Silakan pilih tanggal.");
            return;
        }

        if (!schedule) {
            setError(
                "Ruangan tidak tersedia pada tanggal yang dipilih."
            );
            return;
        }

        if (!startTime || !endTime) {
            setError(
                "Jam mulai dan jam selesai wajib diisi."
            );
            return;
        }

        if (startTime >= endTime) {
            setError(
                "Jam mulai harus lebih kecil dari jam selesai."
            );
            return;
        }

        if (!isTimeAvailable) {
            setError(
                "Waktu yang dipilih bertabrakan dengan booking lain."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId,
                    date,
                    startTime,
                    endTime,

                    // Nama pemesan otomatis dari akun login
                    bookerName: currentUser.username,

                    description: description.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Gagal membuat booking."
                );
            }

            setSuccess(
                `Booking berhasil dibuat. Kode booking: ${data.booking.bookingCode}`
            );

            // Bersihkan input waktu dan keperluan
            setStartTime("");
            setEndTime("");
            setDescription("");

            // Jangan reset currentUser karena
            // user tetap merupakan pemesan booking berikutnya

            // Refresh booking pada tanggal tersebut
            const bookingResponse = await fetch(
                `/api/bookings?roomId=${roomId}&date=${date}`
            );

            if (bookingResponse.ok) {
                const bookingData =
                    await bookingResponse.json();

                setBookings(bookingData.bookings || []);
            }
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Gagal membuat booking."
            );
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // SELECTED DATE DAY
    // =====================================================

    const selectedDay = date
        ? DAYS[
        new Date(
            `${date}T00:00:00.000Z`
        ).getUTCDay()
        ]
        : "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-medium text-blue-600">
                        ROOM BOOKING
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Booking Ruangan
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Pilih ruangan, tanggal, dan waktu penggunaan.
                    </p>
                </div>

                {/* ALERT */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

                    {/* FORM */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* ROOM */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Ruangan
                                </label>

                                <select
                                    value={roomId}
                                    onChange={(e) => {
                                        setRoomId(e.target.value);
                                        setStartTime("");
                                        setEndTime("");
                                        setError("");
                                        setSuccess("");
                                    }}
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
                                    Tanggal
                                </label>

                                <input
                                    type="date"
                                    value={date}
                                    min={getTodayString()}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setStartTime("");
                                        setEndTime("");
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {selectedDay && (
                                    <p className="mt-2 text-xs text-slate-500">
                                        Hari:{" "}
                                        <span className="font-semibold text-slate-700">
                                            {DAY_LABELS[selectedDay]}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* USER INFORMATION */}
                            {/* USER INFORMATION */}
                            {schedule && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Informasi Pemesan
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        {/* NAMA PEMESAN */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Nama Pemesan
                                            </label>

                                            <input
                                                type="text"
                                                value={bookerName}
                                                onChange={(e) => setBookerName(e.target.value)}
                                                placeholder="Masukkan nama pemesan"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        {/* DEPARTMENT */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Department
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    loadingUser
                                                        ? "Memuat..."
                                                        : currentUser?.department || ""
                                                }
                                                readOnly
                                                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                                            />
                                        </div>

                                    </div>

                                    <p className="mt-3 text-xs text-slate-400">
                                        Department diambil otomatis dari akun yang sedang login.
                                    </p>
                                </div>
                            )}

                            {/* AVAILABILITY */}
                            {loadingSchedule && (
                                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    Mengecek ketersediaan ruangan...
                                </div>
                            )}

                            {!loadingSchedule &&
                                roomId &&
                                date &&
                                !schedule && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                        <p className="text-sm font-semibold text-amber-800">
                                            Ruangan tidak tersedia
                                        </p>

                                        <p className="mt-1 text-xs text-amber-700">
                                            Tidak ada jadwal operasional untuk{" "}
                                            {DAY_LABELS[selectedDay]}.
                                        </p>
                                    </div>
                                )}

                            {/* SCHEDULE */}
                            {schedule && (
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-xs font-medium text-blue-600">
                                        JAM OPERASIONAL
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-blue-900">
                                        {schedule.startTime} –{" "}
                                        {schedule.endTime}
                                    </p>
                                </div>
                            )}

                            {/* TIME */}
                            {schedule && (
                                <div className="grid gap-4 sm:grid-cols-2">

                                    {/* START */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Jam Mulai
                                        </label>

                                        <input
                                            type="time"
                                            value={startTime}
                                            min={schedule.startTime}
                                            max={schedule.endTime}
                                            onChange={(e) =>
                                                setStartTime(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* END */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Jam Selesai
                                        </label>

                                        <input
                                            type="time"
                                            value={endTime}
                                            min={schedule.startTime}
                                            max={schedule.endTime}
                                            onChange={(e) =>
                                                setEndTime(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                </div>
                            )}

                            {/* DESCRIPTION */}
                            {schedule && (
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Keperluan
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Contoh: Rapat koordinasi..."
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            )}

                            {/* CONFLICT WARNING */}
                            {startTime &&
                                endTime &&
                                !isTimeAvailable && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-sm font-semibold text-red-700">
                                            Waktu bertabrakan
                                        </p>

                                        <p className="mt-1 text-xs text-red-600">
                                            Silakan pilih waktu lain.
                                        </p>
                                    </div>
                                )}

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    loadingUser ||
                                    loadingSchedule ||
                                    !currentUser ||
                                    !schedule ||
                                    !isTimeAvailable
                                }
                                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {saving
                                    ? "Menyimpan..."
                                    : "Buat Booking"}
                            </button>

                        </form>
                    </section>

                    {/* BOOKING LIST */}
                    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-5">
                            <p className="text-xs font-medium text-slate-400">
                                BOOKING TERDAFTAR
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                Jadwal Hari Ini
                            </h2>
                        </div>

                        {loadingSchedule ? (
                            <p className="text-sm text-slate-400">
                                Memuat jadwal...
                            </p>
                        ) : bookings.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                                <p className="text-sm font-medium text-slate-600">
                                    Belum ada booking
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Waktu masih tersedia.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="rounded-xl border border-slate-200 p-4"
                                    >

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-bold text-slate-900">
                                                {booking.startTime} –{" "}
                                                {booking.endTime}
                                            </span>

                                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                                                Terisi
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            {booking.bookerName}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {booking.department}
                                        </p>

                                        {booking.description && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                {booking.description}
                                            </p>
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </main>
    );
}


