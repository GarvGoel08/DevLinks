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

export const POST = catchAsync(async (req) => {
  const userId = getUserIdFromToken(req);
  const { name, about, imageUrl } = await req.json();

  const userUpdates = {};
  if (name) userUpdates.name = name;
  if (about) userUpdates.about = about;
  if (imageUrl) userUpdates.Profile = imageUrl; // Update profile with the image URL

  const user = await User.findByIdAndUpdate(userId, userUpdates, {
    new: true,
    runValidators: true,
  });

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

export const GET = catchAsync(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  console.log(code);
  const user = await User.findOne({ code });

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
