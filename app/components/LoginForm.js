"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        router.push("/links");
      } else {
      }
    }
  }, [router]);
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("test1234");

  const signUp = async () => {
    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const res = await fetch("/api/user/login", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert("User Logged in successfully");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/links");
    } else {
      const data = await res.json();
      console.log(data);
      alert(
        res.statusText ||
          "An error occurred. Please try again later or contact support"
      );
    }
  };
  return (
    <div className="grow flex items-center justify-center">
      <div className="bg-white flex flex-col my-10 mx-2 text-black p-6 py-8 rounded-lg overflow-x-hidden  min-w-[490px] max-sm:min-w-0 max-sm:w-full">
        <div className="font-semibold text-center text-2xl mb-4">
          Login to DevLinks
        </div>
        <div className="flex flex-col text-sm gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <div>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@capt.io"
              className="p-2 focus:outline-none ease-in duration-150 focus:border-blue-500 hover:border-blue-500  rounded-md bg-[#c6c6c6] bg-opacity-25 shadow-gray-700/50 backdrop-blur-lg border border-white/20"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-2 focus:outline-none ease-in duration-150 focus:border-blue-500 hover:border-blue-500  rounded-md bg-[#c6c6c6] bg-opacity-25 shadow-gray-700/50 backdrop-blur-lg border border-white/20"
            />
          </div>
        </div>
        <button
          onClick={() => signUp()}
          className="bg-blue-800 ease-in duration-150 hover:bg-blue-700 text-white rounded-md p-2 mt-6"
        >
          Login
        </button>
        <div className="text-center mt-4">
          New to DevLinks?{" "}
          <Link href="/" className="underline text-blue-500">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
