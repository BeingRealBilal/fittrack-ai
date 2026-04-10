import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { action, name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Name and password required" }, { status: 400 });
    }

    if (action === "register") {
      const existingUser = await prisma.user.findUnique({ where: { name } });
      if (existingUser) return NextResponse.json({ error: "Name already taken" }, { status: 400 });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { name, password: hashedPassword },
        include: { workouts: true }
      });
      return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, workouts: newUser.workouts } });
    } 
    
    if (action === "login") {
      const user = await prisma.user.findUnique({ where: { name }, include: { workouts: true } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, workouts: user.workouts } });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}