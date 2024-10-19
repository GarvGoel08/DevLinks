import dbConnect from "@/lib/connectDb";
import catchAsync from "@/middleware/catchAsync";
import User from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const { sign } = require("jsonwebtoken");

await dbConnect();

export const PUT = catchAsync(async (req, context) => {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return new NextResponse(
      JSON.stringify({ error: "All fields are required" }),
      {
        status: 400,
      }
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return new NextResponse(JSON.stringify({ error: "User already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const hashed = await bcrypt.hash(password, 10);
  const code = Math.random().toString(36).substring(2, 8);
  const newUser = await User.create({
    name,
    email,
    password: hashed,
    code,
  });

  const token = sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const response = new NextResponse(
    JSON.stringify({ user: newUser, token }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );

  return response;
});
