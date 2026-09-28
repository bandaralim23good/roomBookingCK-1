import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      room: true,
      user: true,
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    take: 10,
  });

  // =========================
  // ADMIN
  // =========================
  if (user.role === "ADMIN") {
    const totalUsers = await prisma.user.count();

    const totalRooms = await prisma.room.count({
      where: {
        isActive: true,
      },
    });

    return (
      <main className="min-h-screen bg-slate-50">
        {/* SIDEBAR */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* LOGO */}
          <div className="flex h-20 items-center border-b border-slate-200 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
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
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 py-6"> <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"> Menu Utama </p> <div className="space-y-1"> {/* Dashboard */} <Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700" > <span>⌂</span> Dashboard </Link> {/* Booking */} <Link href="/booking" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600" > <span>▣</span> Booking Ruangan </Link> {/* Schedule */} <Link href="/schedule" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600" > <span>▤</span> Jadwal Ruangan </Link> </div> <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"> Administrasi </p> <div className="space-y-1"> {/* Users */} <Link href="/users" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600" > <span>♙</span> Pengguna </Link> {/* Rooms */} <Link href="/rooms" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600" > <span>▦</span> Ruangan </Link> </div> </nav>

          {/* USER */}
          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user.username}
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </aside>

        {/* MAIN */}
        <div className="lg:pl-64">
          {/* TOPBAR */}
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-6 lg:px-8">
              <div>
                <p className="text-sm text-slate-400">
                  Dashboard
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  Overview
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {user.username}
                  </p>

                  <p className="text-xs text-slate-400">
                    {user.department}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="px-6 py-8 lg:px-8">
            {/* WELCOME */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-lg">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-medium text-indigo-100">
                  Selamat datang kembali 👋
                </p>

                <h1 className="text-2xl font-bold">
                  Halo, {user.username}
                </h1>

                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Kelola pengguna, ruangan, dan jadwal booking
                  dengan mudah melalui dashboard administrator.
                </p>
              </div>
            </div>

            {/* STATISTICS */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Pengguna
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {totalUsers}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Pengguna terdaftar
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                    ♙
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Ruangan Aktif
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {totalRooms}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Ruangan tersedia
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                    ▦
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTION */}
            <section className="mb-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Akses Cepat
                </h3>

                <p className="text-sm text-slate-400">
                  Fitur yang dapat digunakan dari dashboard
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Tambah User */}
                <Link
                  href="/users/new"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                    👤
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    Tambah User
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tambahkan pengguna baru
                  </p>
                </Link>

                {/* Tambah Ruangan */}
                <Link
                  href="/rooms/new"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                    🏢
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    Tambah Ruangan
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tambahkan ruangan baru
                  </p>
                </Link>

                {/* Booking Ruangan */}
                <Link
                  href="/booking"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                    📅
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    Booking Ruangan
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Buat pemesanan ruangan
                  </p>
                </Link>

                {/* Lihat Jadwal */}
                <Link
                  href="/schedule"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                    📋
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    Lihat Jadwal Terbaru
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Lihat jadwal penggunaan ruangan
                  </p>
                </Link>

              </div>
            </section>

            {/* SCHEDULE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Jadwal Ruangan
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Booking yang akan datang
                  </p>
                </div>

                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {bookings.length} Jadwal
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                    ▦
                  </div>

                  <p className="font-medium text-slate-700">
                    Belum ada jadwal booking
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Jadwal booking akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-semibold text-indigo-600">
                          {booking.room.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {booking.room.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {booking.bookerName} · {booking.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 md:text-right">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {booking.date.toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Terjadwal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // USER DASHBOARD
  // =========================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
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
        </div>


        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
            >
              <span>⌂</span>
              Dashboard
            </Link>

            {/* Booking Ruangan */}
            <Link
              href="/booking"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
            >
              <span>▣</span>
              Booking Ruangan
            </Link>

            {/* Jadwal Ruangan */}
            <Link
              href="/schedule"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
            >
              <span>▤</span>
              Jadwal Ruangan
            </Link>
          </div>
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.username}
              </p>

              <p className="text-xs text-slate-400">
                User
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6 lg:px-8">
            <div>
              <p className="text-sm text-slate-400">
                Dashboard
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                Overview
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="px-6 py-8 lg:px-8">
          {/* WELCOME */}
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white shadow-lg">
            <p className="text-sm font-medium text-indigo-100">
              Selamat datang 👋
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              Halo, {user.username}
            </h1>

            <p className="mt-2 text-sm text-indigo-100">
              Kelola booking dan lihat jadwal ruangan dengan mudah.
            </p>
          </div>

          {/* ACTION */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/booking"
              className="block rounded-2xl bg-indigo-600 p-6 text-left text-white shadow-md transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl">
                +
              </div>

              <p className="text-lg font-bold">
                Booking Ruangan
              </p>

              <p className="mt-1 text-sm text-indigo-100">
                Buat pemesanan ruangan baru.
              </p>
            </Link>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-400">
                Department
              </p>

              <p className="mt-3 text-xl font-bold text-slate-900">
                {user.department}
              </p>

              <div className="mt-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                User
              </div>
            </div>
          </div>

          {/* SCHEDULE */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h3 className="font-bold text-slate-900">
                Jadwal Ruangan
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Booking yang akan datang
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                  ▦
                </div>

                <p className="font-medium text-slate-700">
                  Belum ada jadwal booking
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Jadwal booking akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-semibold text-indigo-600">
                        {booking.room.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {booking.room.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {booking.bookerName} · {booking.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 md:text-right">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {booking.date.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Terjadwal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
