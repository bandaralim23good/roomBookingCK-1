import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
// GET - mengambil daftar ruangan aktif 
export async function GET() {
  try {
    const rooms = await prisma.room.findMany(
      { where: { isActive: true, }, select: { id: true, name: true, }, orderBy: { name: "asc", }, });
    return NextResponse.json({ rooms, });
  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    return NextResponse.json({ error: "Gagal mengambil data ruangan.", },
      { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

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

    if (!name) {
      return NextResponse.json(
        {
          error: "Nama ruangan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
      return NextResponse.json(
        {
          error: "Kapasitas harus berupa angka minimal 1.",
        },
        { status: 400 }
      );
    }

    const existingRoom = await prisma.room.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingRoom) {
      return NextResponse.json(
        {
          error: "Nama ruangan sudah terdaftar.",
        },
        { status: 409 }
      );
    }

    const room = await prisma.room.create({
      data: {
        name,
        location: location || null,
        capacity,
      },
    });

    return NextResponse.json(
      {
        message: "Ruangan berhasil ditambahkan.",
        room,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD ROOM ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal menambahkan ruangan.",
      },
      { status: 500 }
    );
  }
}
