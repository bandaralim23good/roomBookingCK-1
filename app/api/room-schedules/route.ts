import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

type DayOfWeek = (typeof DAYS)[number];

type ScheduleInput = {
    dayOfWeek: DayOfWeek;
    startTime: string | null;
    endTime: string | null;
    isActive: boolean;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId wajib diisi." },
        { status: 400 }
      );
    }

    const schedules = await prisma.roomSchedule.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return NextResponse.json({
      schedules,
    });
  } catch (error) {
    console.error("GET ROOM SCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil jadwal ruangan.",
      },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const roomId =
            typeof body.roomId === "string"
                ? body.roomId.trim()
                : "";

        const schedules = body.schedules as ScheduleInput[];

        if (!roomId) {
            return NextResponse.json(
                { error: "Ruangan wajib dipilih." },
                { status: 400 }
            );
        }

        if (!Array.isArray(schedules)) {
            return NextResponse.json(
                { error: "Format jadwal tidak valid." },
                { status: 400 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return NextResponse.json(
                { error: "Ruangan tidak ditemukan." },
                { status: 404 }
            );
        }

        for (const schedule of schedules) {
            if (!DAYS.includes(schedule.dayOfWeek)) {
                return NextResponse.json(
                    { error: "Hari tidak valid." },
                    { status: 400 }
                );
            }

            if (!schedule.isActive) {
                continue;
            }

            if (!schedule.startTime || !schedule.endTime) {
                return NextResponse.json(
                    {
                        error: `Jam penggunaan untuk ${schedule.dayOfWeek} wajib diisi.`,
                    },
                    { status: 400 }
                );
            }

            if (schedule.startTime >= schedule.endTime) {
                return NextResponse.json(
                    {
                        error: `Jam mulai harus lebih kecil dari jam selesai.`,
                    },
                    { status: 400 }
                );
            }
        }

        await prisma.$transaction(
            schedules.map((schedule) =>
                prisma.roomSchedule.upsert({
                    where: {
                        roomId_dayOfWeek: {
                            roomId,
                            dayOfWeek: schedule.dayOfWeek,
                        },
                    },
                    update: {
                        startTime: schedule.startTime || "08:00",
                        endTime: schedule.endTime || "17:00",
                        isActive: schedule.isActive,
                    },
                    create: {
                        roomId,
                        dayOfWeek: schedule.dayOfWeek,
                        startTime: schedule.startTime || "08:00",
                        endTime: schedule.endTime || "17:00",
                        isActive: schedule.isActive,
                    },
                })
            )
        );

        return NextResponse.json({
            message: "Jadwal ruangan berhasil disimpan.",
        });
    } catch (error) {
        console.error("SAVE ROOM SCHEDULE ERROR:", error);

        return NextResponse.json(
            { error: "Gagal menyimpan jadwal ruangan." },
            { status: 500 }
        );
    }
}
