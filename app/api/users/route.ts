import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      username,
      department,
      password,
      role,
    } = body;

    if (!username || !department || !password) {
      return NextResponse.json(
        {
          error: "Username, department, dan password wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Username sudah terdaftar",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        department,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER",
      },
    });

    return NextResponse.json(
      {
        message: "User berhasil ditambahkan",
        user: {
          id: user.id,
          username: user.username,
          department: user.department,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal menambahkan user",
      },
      { status: 500 }
    );
  }
}