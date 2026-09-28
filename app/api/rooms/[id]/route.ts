import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET ROOM
// =========================
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const room = await prisma.room.findUnique({
      where: {
        id,
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

    if (!room) {
      return NextResponse.json(
        {
          error: "Ruangan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      room,
    });
  } catch (error) {
    console.error("GET ROOM ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data ruangan.",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE ROOM
// =========================
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const capacity =
      body.capacity !== "" &&
      body.capacity !== undefined &&
      body.capacity !== null
        ? Number(body.capacity)
        : null;

    const isActive =
      typeof body.isActive === "boolean"
        ? body.isActive
        : true;

    // =========================
    // VALIDASI
    // =========================

    if (!name) {
      return NextResponse.json(
        {
          error: "Nama ruangan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (
      capacity !== null &&
      (!Number.isInteger(capacity) || capacity < 1)
    ) {
      return NextResponse.json(
        {
          error: "Kapasitas harus berupa angka minimal 1.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK ROOM
    // =========================

    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!existingRoom) {
      return NextResponse.json(
        {
          error: "Ruangan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // =========================
    // CEK NAMA DUPLIKAT
    // =========================

    const duplicateRoom = await prisma.room.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (duplicateRoom) {
      return NextResponse.json(
        {
          error: "Nama ruangan sudah digunakan.",
        },
        { status: 409 }
      );
    }

    // =========================
    // UPDATE
    // =========================

    const room = await prisma.room.update({
      where: {
        id,
      },
      data: {
        name,
        location: location || null,
        capacity,
        isActive,
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

    return NextResponse.json({
      message: "Ruangan berhasil diperbarui.",
      room,
    });
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal memperbarui ruangan.",
      },
      { status: 500 }
    );
  }
}
// =========================
// DELETE ROOM
// =========================
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Cek room
    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!existingRoom) {
      return NextResponse.json(
        {
          error: "Ruangan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Hapus room
    await prisma.room.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Ruangan berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Ruangan tidak dapat dihapus. Pastikan ruangan tidak sedang digunakan oleh booking.",
      },
      { status: 500 }
    );
  }
}
