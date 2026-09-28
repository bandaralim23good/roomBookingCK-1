import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function isValidTime(time: string) {
  return /^\d{2}:\d{2}$/.test(time);
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function isValidDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime());
}

// =====================================================
// GET
// /api/bookings?roomId=xxx&date=2026-09-28
// =====================================================

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const roomId = searchParams.get("roomId");
    const dateString = searchParams.get("date");

    if (!roomId || !dateString) {
      return NextResponse.json(
        {
          error: "roomId dan date wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(dateString)) {
      return NextResponse.json(
        {
          error: "Format tanggal tidak valid.",
        },
        { status: 400 }
      );
    }

    const date = new Date(`${dateString}T00:00:00.000Z`);

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        date,
      },
      select: {
        id: true,
        bookingCode: true,
        roomId: true,
        userId: true,
        date: true,
        startTime: true,
        endTime: true,
        bookerName: true,
        department: true,
        description: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json({
      bookings,
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data booking.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST
// /api/bookings
// =====================================================

export async function POST(request: Request) {
  try {
    // ---------------------------------------------
    // 1. Cek login
    // ---------------------------------------------

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Anda harus login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // ---------------------------------------------
    // 2. Ambil request body
    // ---------------------------------------------

    const body = await request.json();

    const roomId =
      typeof body.roomId === "string"
        ? body.roomId.trim()
        : "";

    const dateString =
      typeof body.date === "string"
        ? body.date.trim()
        : "";

    const startTime =
      typeof body.startTime === "string"
        ? body.startTime.trim()
        : "";

    const endTime =
      typeof body.endTime === "string"
        ? body.endTime.trim()
        : "";

    const bookerName =
      typeof body.bookerName === "string"
        ? body.bookerName.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    // ---------------------------------------------
    // 3. Validasi input
    // ---------------------------------------------

    if (!roomId) {
      return NextResponse.json(
        {
          error: "Ruangan wajib dipilih.",
        },
        { status: 400 }
      );
    }

    if (!dateString) {
      return NextResponse.json(
        {
          error: "Tanggal booking wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(dateString)) {
      return NextResponse.json(
        {
          error: "Format tanggal tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json(
        {
          error: "Format jam harus HH:MM.",
        },
        { status: 400 }
      );
    }

    if (!bookerName) {
      return NextResponse.json(
        {
          error: "Nama pemesan wajib diisi.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 4. Validasi jam
    // ---------------------------------------------

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (
      startMinutes < 0 ||
      startMinutes > 1439 ||
      endMinutes < 0 ||
      endMinutes > 1439
    ) {
      return NextResponse.json(
        {
          error: "Jam booking tidak valid.",
        },
        { status: 400 }
      );
    }

    if (startMinutes >= endMinutes) {
      return NextResponse.json(
        {
          error: "Jam mulai harus lebih kecil dari jam selesai.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 5. Cari ruangan
    // ---------------------------------------------

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
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

    if (!room.isActive) {
      return NextResponse.json(
        {
          error: "Ruangan sedang tidak aktif.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 6. Tentukan hari
    // ---------------------------------------------

    const date = new Date(`${dateString}T00:00:00.000Z`);

    const dayOfWeek = DAYS[date.getUTCDay()];

    // ---------------------------------------------
    // 7. Ambil jadwal operasional ruangan
    // ---------------------------------------------

    const schedule = await prisma.roomSchedule.findUnique({
      where: {
        roomId_dayOfWeek: {
          roomId,
          dayOfWeek,
        },
      },
    });

    if (!schedule || !schedule.isActive) {
      return NextResponse.json(
        {
          error: `Ruangan tidak memiliki jadwal operasional pada hari ${dayOfWeek}.`,
        },
        { status: 400 }
      );
    }

    const scheduleStart = timeToMinutes(schedule.startTime);
    const scheduleEnd = timeToMinutes(schedule.endTime);

    // ---------------------------------------------
    // 8. Pastikan booking berada dalam jadwal
    // ---------------------------------------------

    if (
      startMinutes < scheduleStart ||
      endMinutes > scheduleEnd
    ) {
      return NextResponse.json(
        {
          error: `Booking harus berada dalam jam operasional ${schedule.startTime} - ${schedule.endTime}.`,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 9. Cek bentrok booking
    //
    // Bentrok apabila:
    //
    // booking lama mulai < booking baru selesai
    // DAN
    // booking lama selesai > booking baru mulai
    // ---------------------------------------------

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        date,
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: startTime,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error: `Waktu bentrok dengan booking ${conflictingBooking.startTime} - ${conflictingBooking.endTime}.`,
          conflict: {
            id: conflictingBooking.id,
            bookingCode: conflictingBooking.bookingCode,
            startTime: conflictingBooking.startTime,
            endTime: conflictingBooking.endTime,
          },
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------
    // 10. Buat booking
    // ---------------------------------------------

    const booking = await prisma.booking.create({
      data: {
        roomId,
        userId: session.user.id,
        date,
        startTime,
        endTime,
        bookerName,
        department: session.user.department,
        description: description || null,
      },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            username: true,
            department: true,
          },
        },
      },
    });

    // ---------------------------------------------
    // 11. Response
    // ---------------------------------------------

    return NextResponse.json(
      {
        message: "Booking berhasil dibuat.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal membuat booking.",
      },
      { status: 500 }
    );
  }
}
