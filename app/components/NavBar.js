"use client";
import Image from "next/image";
import devToImg from "../images/logo-devlinks-large.svg";
import devToImgSm from "../images/logo-devlinks-small.svg";
import previewImg from "../images/icon-preview-header.svg";
import { act, useEffect, useState } from "react";

export default function NavBar() {
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(window.location.pathname === "/links");
  }, []);

  const [activeProfile, setActiveProfile] = useState(false);
  useEffect(() => {
    setActiveProfile(window.location.pathname === "/profile");
  }, []);
  const [userCode, setUserCode] = useState("");
  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        const response = await fetch("/api/user/links", {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });

        if (response.ok) {
          const fetchedData = await response.json();
          setUserCode(fetchedData.code);
        } else {
          console.error("Failed to fetch user code");
        }
      } catch (error) {
        console.error("Error fetching user code:", error);
      }
    };

    if (token) {
      fetchUserCode();
    }
  }, [token]);

  return (
    <header className="flex font-instrumental-sans flex-col justify-center p-6 w-full text-base font-semibold max-md:px-5 max-md:max-w-full">
      <nav className="flex overflow-hidden flex-row gap-8 justify-center py-4 pr-4 pl-6 w-full bg-white rounded-xl max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
          <div>
            <Image
              src={devToImg}
              width={183}
              height={40}
              alt="Dev.to logo"
              className="max-md:hidden"
            />
            <Image
              src={devToImgSm}
              width={32}
              height={32}
              alt="Dev.to logo"
              className="md:hidden"
            />
          </div>
          <div className="flex gap-2 items-start self-stretch my-auto">
            <a
              href="/links"
              className={`${
                token ? "" : "hidden"
              } flex gap-2 items-center px-7 py-3 rounded-lg max-md:px-5 text-neutral-500 hover:text-violet-600 ${
                active ? "text-violet-600 bg-violet-100" : ""
              } max-sm:px-3`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                fill="none"
                viewBox="0 0 21 20"
              >
                <path
                  fill="currentColor"
                  d="M11.154 14.65a.936.936 0 0 1 0 1.329l-.464.464a4.689 4.689 0 1 1-6.631-6.631l1.884-1.884a4.687 4.687 0 0 1 6.432-.194.941.941 0 0 1-1.25 1.407 2.813 2.813 0 0 0-3.857.114l-1.883 1.882a2.813 2.813 0 1 0 3.978 3.978l.464-.464a.936.936 0 0 1 1.327 0ZM16.94 3.558a4.695 4.695 0 0 0-6.63 0l-.465.464a.94.94 0 1 0 1.328 1.328l.464-.464a2.813 2.813 0 0 1 3.978 3.978l-1.883 1.885a2.813 2.813 0 0 1-3.858.111.942.942 0 0 0-1.25 1.407 4.688 4.688 0 0 0 6.43-.19l1.884-1.884a4.695 4.695 0 0 0 .002-6.633v-.002Z"
                />
              </svg>
              <span className="self-stretch my-auto max-md:hidden ">Links</span>
            </a>
            <a
              href="/profile"
              className={`${
                token ? "" : "hidden"
              } flex gap-2 items-center px-7 py-3 rounded-lg max-md:px-5 text-neutral-500 hover:text-violet-600 ${
                activeProfile ? "text-violet-600 bg-violet-100" : ""
              } max-sm:px-3`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                fill="none"
                viewBox="0 0 21 20"
              >
                <path
                  fill="currentColor"
                  d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z"
                />
              </svg>
              <span className="self-stretch my-auto max-md:hidden">
                Profile Details
              </span>
            </a>
          </div>
          <a
          href={`/card/${userCode}`}
            className={`${
              token ? "" : "hidden"
            } hover:bg-[#EFEBFF] flex flex-col justify-center self-stretch px-7 py-3 my-auto text-violet-600 whitespace-nowrap rounded-lg border border-violet-600 border-solid max-md:px-2`}
          >
            <span className="max-sm:hidden">Preview</span>
            <Image
              src={previewImg}
              width={16}
              height={16}
              alt="Preview"
              className="sm:hidden"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
