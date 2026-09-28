import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
// =========================
// GET USER
// =========================
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        department: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data user.",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE USER
// =========================
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const department =
      typeof body.department === "string"
        ? body.department.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const role =
      body.role === "ADMIN" ? "ADMIN" : "USER";

    // Validasi
    if (!username || !department) {
      return NextResponse.json(
        {
          error: "Username dan department wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cek user
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Cek username dipakai user lain
    const usernameUsed = await prisma.user.findFirst({
      where: {
        username,
        NOT: {
          id,
        },
      },
    });

    if (usernameUsed) {
      return NextResponse.json(
        {
          error: "Username sudah digunakan oleh user lain.",
        },
        { status: 409 }
      );
    }

    // Data yang akan diupdate
    const updateData: {
      username: string;
      department: string;
      role: "ADMIN" | "USER";
      password?: string;
    } = {
      username,
      department,
      role,
    };

    // Password hanya diubah jika diisi
    if (password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json(
          {
            error: "Password minimal 6 karakter.",
          },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        department: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "User berhasil diperbarui.",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal memperbarui user.",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE USER
// =========================
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Cek user
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Hapus user
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "User berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal menghapus user.",
      },
      { status: 500 }
    );
  }
}
