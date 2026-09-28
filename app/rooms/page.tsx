import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteRoomButton from "./DeleteRoomButton";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

export default async function RoomsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Hanya ADMIN yang boleh mengelola ruangan
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const rooms = await prisma.room.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            location: true,
            capacity: true,
            isActive: true,
            createdAt: true,
        },
    });

    const activeRooms = rooms.filter((room) => room.isActive);
    const inactiveRooms = rooms.filter((room) => !room.isActive);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            ← Dashboard
                        </Link>

                        <h1 className="mt-2 text-2xl font-bold text-slate-900">
                            Kelola Ruangan
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Kelola ruangan yang tersedia untuk sistem booking.
                        </p>
                    </div>

                    <Link
                        href="/rooms/new"
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                    >
                        + Tambah Ruangan
                    </Link>
                </div>
            </header>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* STATISTICS */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Ruangan
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {rooms.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Ruangan Aktif
                        </p>

                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {activeRooms.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Ruangan Nonaktif
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-400">
                            {inactiveRooms.length}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="font-semibold text-slate-900">
                            Daftar Ruangan
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Semua ruangan yang terdaftar dalam sistem.
                        </p>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                🏢
                            </div>

                            <h3 className="font-semibold text-slate-900">
                                Belum ada ruangan
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Tambahkan ruangan pertama untuk mulai menggunakan sistem.
                            </p>

                            <Link
                                href="/rooms/new"
                                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                + Tambah Ruangan
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[750px]">
                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Ruangan
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Lokasi
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Kapasitas
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {rooms.map((room) => (
                                        <tr
                                            key={room.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* ROOM */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                                                        🏢
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {room.name}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            ID: {room.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* LOCATION */}
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {room.location || "-"}
                                            </td>

                                            {/* CAPACITY */}
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {room.capacity
                                                    ? `${room.capacity} orang`
                                                    : "-"}
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-4">
                                                {room.isActive ? (
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/rooms/${room.id}/edit`}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                        Edit
                                                    </Link>

                                                    {/* Delete akan kita pasang setelah API */}
                                                    <DeleteRoomButton
                                                        roomId={room.id}
                                                        roomName={room.name}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
