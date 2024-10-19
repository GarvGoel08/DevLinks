import dbConnect from "@/lib/connectDb";
import catchAsync from "@/middleware/catchAsync";
import User from "@/models/users";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await dbConnect();

const getUserIdFromToken = (req) => {
  const token = req.headers.get("auth-token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

export const GET = catchAsync(async (req, context) => {
  const userId = getUserIdFromToken(req);

  const user = await User.findById(userId);

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new NextResponse(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = catchAsync(async (req, context) => {
  const userId = getUserIdFromToken(req);
  const { links } = await req.json();

  if (!Array.isArray(links)) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid input, expected an array of links" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { Links: links },
    { new: true, runValidators: true }
  );

  if (!user) {
    return new NextResponse(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new NextResponse(JSON.stringify(user.Links), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
