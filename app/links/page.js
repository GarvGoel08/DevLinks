"use client";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { LinkIcon } from "@heroicons/react/outline";
import dragAndDrop from "../images/icon-drag-and-drop.svg";
import Image from "next/image";
import imgEpty from "../images/illustration-empty.svg";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GithubImage from "../images/icon-github.svg";
import YoutubImage from "../images/icon-youtube.svg";
import FaceBookImage from "../images/icon-facebook.svg";
import LinkedinImage from "../images/icon-linkedin.svg";
import twitterImage from "../images/icon-twitter.svg";
import { useRouter } from "next/navigation";
import gitLabImage from '../images/icon-gitlab.svg';
import twitchImage from '../images/icon-twitch.svg';

const platforms = [
  {
    id: 1,
    name: "GitHub",
    url: "https://www.github.com/",
    color: "black",
    icon: <Image src={GithubImage} alt="GitHub" height={16} width={16} />,
  },
  {
    id: 2,
    name: "YouTube",
    url: "https://www.youtube.com/",
    color: "red",
    icon: <Image src={YoutubImage} alt="YouTube" height={16} width={16} />,
  },
  {
    id: 3,
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    color: "#0a66c2",
    icon: <Image src={LinkedinImage} alt="LinkedIn" height={16} width={16} />,
  },
  {
    id: 4,
    name: "Facebook",
    url: "https://www.facebook.com/",
    color: "#1877F2",
    icon: <Image src={FaceBookImage} alt="Facebook" height={16} width={16} />,
  },
  {
    id: 5,
    name: "Twitter",
    url: "https://www.x.com/",
    color: "#1877F2",
    icon: <Image src={twitterImage} alt="Twitter" height={16} width={16} />,
  },
  {
    id: 6,
    name: "GitLab",
    url: "https://www.gitlab.com/",
    color: "#fca326",
    icon: <Image src={gitLabImage} alt="GitLab" height={16} width={16} />,
  },
  {
    id: 7,
    name: "Twitch",
    url: "https://www.twitch.com/",
    color: "#6441a5",
    icon: <Image src={twitchImage} alt="Twitch" height={16} width={16} />,
  }
];
const DraggableItem = ({ link, index, removeLink, updateLink }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 mt-6 bg-gray-50 rounded-lg shadow-sm space-y-4 relative border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3" {...listeners} {...attributes}>
          <Image src={dragAndDrop} alt="Drag and Drop" width={12} height={12} />
          <span className="text-lg font-medium max-md:text-[14px] text-gray-700">
            Link #{index + 1}
          </span>
        </div>
        <button
          onClick={() => removeLink(link.id)}
          className="text-gray-500 hover:text-red-500 max-md:text-[14px]"
        >
          Remove
        </button>
      </div>

      <Listbox
        value={link.platform}
        onChange={(value) => updateLink(link.id, "platform", value)}
      >
        <div className="relative mt-2">
          <ListboxButton className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 flex items-center justify-between text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <span className="flex items-center color-[#737373]">
              {link.platform.icon}
              <span className="ml-2"> {link.platform.name}</span>
            </span>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            {platforms.map((platform) => (
              <ListboxOption
                key={platform.id}
                value={platform}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center">
                    <span className="mr-2">{platform.icon}</span>
                    <span className={selected ? "font-medium" : "font-normal"}>
                      {platform.name}
                    </span>
                    {selected && (
                      <CheckIcon className="w-5 h-5 ml-auto text-indigo-500" />
                    )}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          <LinkIcon className="w-5 h-5" />
        </span>
        <div className={`flex flex-row max-sm:flex-wrap items-center bg-white rounded-xl ${
              link.error ? "border-red-500 border-2" : ""
            }`}>
          <input
            type="text"
            placeholder={`e.g. ${link.platform.url}yourprofile`}
            value={link.url}
            onChange={(e) => updateLink(link.id, "url", e.target.value)}
            className={`w-full pl-10 py-2 border rounded-lg focus:outline-none text-gray-700 ${
              link.error ? "border-none" : "border-gray-300 focus:ring-indigo-400 hover:ring-2 hover:ring-indigo-300  focus:ring-2"
            } `}
          />
          {link.error && (
            <span className="text-red-500 text-sm text-nowrap mr-3 max-sm:hidden">{link.error}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LinksManager() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/Login");
      } else {
        setToken(storedToken);
      }
    }
    console.log("ENV");
  }, [router]);
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/user/links", {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });

        if (response.ok) {
          const fetchedData = await response.json();
          const fetchedLinks = fetchedData.Links;

          // Map the fetched links to include platform info
          const updatedLinks = fetchedLinks.map((link) => {
            const platform = platforms.find(
              (p) => p.name === link.platform.name
            );
            return {
              ...link,
              id: crypto.randomUUID(),
              platform: platform || platforms[0], // Default to the first platform if not found
            };
          });

          setLinks(updatedLinks);
        } else {
          console.error("Failed to fetch links");
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    if (token) {
      fetchLinks();
    }
  }, [token]);

  const [links, setLinks] = useState([
    { id: crypto.randomUUID(), platform: platforms[0], url: "" },
  ]);

  const addLink = () =>
    setLinks([
      ...links,
      { id: crypto.randomUUID(), platform: platforms[0], url: "" },
    ]);

  const removeLink = (id) => setLinks(links.filter((link) => link.id !== id));

  const updateLink = (id, key, value) => {
    setLinks((links) =>
      links.map((link) => (link.id === id ? { ...link, [key]: value } : link))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setLinks((prevLinks) => {
      const oldIndex = prevLinks.findIndex((link) => link.id === active.id);
      const newIndex = prevLinks.findIndex((link) => link.id === over.id);
      return arrayMove(prevLinks, oldIndex, newIndex);
    });
  };
  const isValidLink = (link) => {
    return link.url.startsWith(link.platform.url);
  };

  const updateLinks = async () => {
    let hasErrors = false;
    const updatedLinks = links.map((link) => {
      if (!isValidLink(link)) {
        hasErrors = true;
        return {
          ...link,
          error: "Invalid link format. Please check your URL.",
        };
      }
      return { ...link, error: null }; // Reset error if valid
    });

    setLinks(updatedLinks);
    if (hasErrors) return;
    try {
      const response = await fetch("/api/user/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          links: links,
        }),
      });

      if (response.ok) {
        const updatedLinks = await response.json();
        alert("Links updated successfully");
      } else {
        alert("Failed to update links");

        console.error("Failed to update links");
        const err = await response.json();
        console.error(err);
      }
    } catch (error) {
      console.error("Error updating links:", error);
    }
  };
  return (
    <div className="flex bg-[#FAFAFA] flex-col items-center min-h-screen">
      <NavBar />
      <div className="flex flex-row grow mb-6 gap-6 w-full px-6">
        <div className="bg-white flex flex-col items-center  max-h-screen p-3 py-12 rounded-xl w-1/2 max-lg:hidden max-w-[380px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="auto"
            style={{ maxHeight: "100%" }}
            width="75%"
            fill="none"
            viewBox="0 0 308 632"
          >
            <path
              stroke="#737373"
              d="M1 54.5C1 24.953 24.953 1 54.5 1h199C283.047 1 307 24.953 307 54.5v523c0 29.547-23.953 53.5-53.5 53.5h-199C24.953 631 1 607.047 1 577.5v-523Z"
            />
            <path
              fill="#fff"
              stroke="#737373"
              d="M12 55.5C12 30.923 31.923 11 56.5 11h24C86.851 11 92 16.149 92 22.5c0 8.008 6.492 14.5 14.5 14.5h95c8.008 0 14.5-6.492 14.5-14.5 0-6.351 5.149-11.5 11.5-11.5h24c24.577 0 44.5 19.923 44.5 44.5v521c0 24.577-19.923 44.5-44.5 44.5h-195C31.923 621 12 601.077 12 576.5v-521Z"
            />
            <circle cx="153.5" cy="112" r="48" fill="#EEE" />
            <rect width="160" height="16" x="73.5" y="185" fill="#EEE" rx="8" />
            <rect width="72" height="8" x="117.5" y="214" fill="#EEE" rx="4" />

            {[...Array(5)].map((_, index) => {
              const link = links[index]; // Get the link at the current index
              const yPosition = 278 + index * 56; // Calculate y position

              return (
                <g key={index} transform={`translate(35, ${yPosition})`}>
                  {link ? (
                    <>
                      <rect
                        width="237"
                        height="44"
                        fill={link.platform.color}
                        rx="8"
                      />

                      <text
                        x="12"
                        y="28"
                        fill="#FFF"
                        fontSize="16"
                        fontWeight="bold"
                        fontFamily="Arial"
                      >
                        {link.platform.name}
                      </text>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                        x="210"
                        t
                        y="14"
                      >
                        <path
                          fill="#fff"
                          d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <rect width="237" height="44" fill="#EEE" rx="8" />
                      <rect
                        width="160"
                        height="16"
                        x="73.5"
                        y="3"
                        fill="#EEE"
                        rx="8"
                      />
                      <rect
                        width="72"
                        height="8"
                        x="117.5"
                        y="24"
                        fill="#EEE"
                        rx="4"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex-grow rounded-xl bg-white">
          <div className="p-8 py-12 flex flex-col justify-between h-full bg-white rounded-lg">
            <div className="flex flex-col grow">
              <h2 className="text-[32px] max-sm:text-[24px] font-semibold text-[#333333]">
                Customize your links
              </h2>
              <p className="text-base max-sm:text-[14px] mb-6 mt-1 font-semibold text-[#737373]">
                Add/edit/remove links below and then share all your profiles
                with the world!
              </p>
              <button
                onClick={addLink}
                className="w-full py-2 border-[#633CFF] text-[#633CFF] border-[1px] font-semibold rounded-lg hover:bg-[#EFEBFF]"
              >
                + Add new link
              </button>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map((link) => link.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {links.length === 0 && (
                    <div className="flex rounded-xl py-8 px-20 max-md:px-8 flex-col bg-[#FAFAFA] items-center justify-center grow mt-6">
                      <Image
                        src={imgEpty}
                        alt="No links"
                        width={200}
                        height={200}
                      />
                      <p className="text-[#333333] text-2xl font-bold mt-4">
                        Let’s get you started
                      </p>
                      <p className="text-[#737373] text-base mt-6">
                        Use the “Add new link” button to get started. Once you
                        have more than one link, you can reorder and edit them.
                        We’re here to help you share your profiles with
                        everyone!
                      </p>
                    </div>
                  )}
                  {links.map((link, index) => (
                    <DraggableItem
                      key={link.id}
                      link={link}
                      index={index}
                      removeLink={removeLink}
                      updateLink={updateLink}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
            <div className="flex flex-row-reverse">
              <button
                onClick={updateLinks}
                className="px-4 py-2  bg-[#633CFF] text-white font-semibold rounded-lg mt-6 hover:bg-[#4F2CFF]"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
