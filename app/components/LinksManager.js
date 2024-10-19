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

const platforms = [
  { id: 1, name: "GitHub", url: "https://github.com/", icon: "🐙" },
  { id: 2, name: "YouTube", url: "https://youtube.com/", icon: "📺" },
  { id: 3, name: "LinkedIn", url: "https://linkedin.com/", icon: "🔗" },
  { id: 4, name: "Facebook", url: "https://facebook.com/", icon: "📘" },
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
        {/* Drag Handle applied only to the drag-and-drop icon */}
        <div className="flex flex-row gap-3" {...listeners} {...attributes}>
          <Image src={dragAndDrop} alt="Drag and Drop" width={12} height={12} />
          <span className="text-lg font-medium text-gray-700">
            Link #{index + 1}
          </span>
        </div>
        <button
          onClick={() => removeLink(link.id)}
          className="text-gray-500 hover:text-red-500"
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
            <span className="flex items-center">
              {link.platform.icon} {link.platform.name}
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
        <input
          type="text"
          placeholder={`e.g. ${link.platform.url}yourprofile`}
          value={link.url}
          onChange={(e) => updateLink(link.id, "url", e.target.value)}
          className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:ring-2 hover:ring-indigo-300 text-gray-700"
        />
      </div>
    </div>
  );
};

export default function LinksManager() {
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

  return (
    <div className="flex bg-[#FAFAFA] flex-col items-center min-h-screen">
      <NavBar />
      <div className="flex flex-row grow mb-6 gap-6 w-full px-6">
        <div className="bg-white flex flex-col items-center max-h-screen p-3 py-12 rounded-xl w-1/2 max-w-[380px]">
          {/* Your SVG code here */}
        </div>
        <div className="flex-grow rounded-xl bg-white">
          <div className="p-8 py-12 bg-white rounded-lg">
            <h2 className="text-[32px] font-semibold text-[#333333]">
              Customize your links
            </h2>
            <p className="text-base mb-6 mt-1 font-semibold text-[#737373]">
              Add/edit/remove links below and then share all your profiles with
              the world!
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
        </div>
      </div>
    </div>
  );
}
