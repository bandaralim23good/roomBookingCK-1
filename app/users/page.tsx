import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteUserButton from "./DeleteUserButton";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

export default async function UsersPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Hanya ADMIN yang boleh mengelola user
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            username: true,
            department: true,
            role: true,
            createdAt: true,
        },
    });

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                ← Dashboard
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Kelola User
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Kelola pengguna yang dapat mengakses sistem booking ruangan.
                        </p>
                    </div>

                    <Link
                        href="/users/new"
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                    >
                        + Tambah User
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Statistik */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total User</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {users.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Admin</p>
                        <p className="mt-2 text-3xl font-bold text-indigo-600">
                            {users.filter((user) => user.role === "ADMIN").length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">User Biasa</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {users.filter((user) => user.role === "USER").length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="font-semibold text-slate-900">
                            Daftar Pengguna
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Semua pengguna yang terdaftar dalam sistem.
                        </p>
                    </div>

                    {users.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                👤
                            </div>

                            <h3 className="font-semibold text-slate-900">
                                Belum ada user
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Tambahkan user pertama untuk mulai menggunakan sistem.
                            </p>

                            <Link
                                href="/users/new"
                                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                + Tambah User
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            User
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Departemen
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Dibuat
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* User */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {user.username}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            ID: {user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department */}
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {user.department}
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4">
                                                {user.role === "ADMIN" ? (
                                                    <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                        ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                        USER
                                                    </span>
                                                )}
                                            </td>

                                            {/* Created */}
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Intl.DateTimeFormat("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }).format(user.createdAt)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeleteUserButton
                                                        userId={user.id}
                                                        username={user.username}
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
