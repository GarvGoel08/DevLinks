"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function ProfileUpdate() {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // State for the image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data from the API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/links", {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        const userData = await response.json();
        
        if (response.ok) {
          setName(userData.name);
          setAbout(userData.about);
          setImageUrl(userData.Profile || ""); // Assuming 'image' holds the URL
        } else {
          setError(userData.error || "Failed to fetch user data.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let newImageUrl = imageUrl; // Use existing URL by default

      if (imageFile) {
        const imageRef = ref(storage, `profile_images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        newImageUrl = await getDownloadURL(imageRef);
      }

      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, about, imageUrl: newImageUrl }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setName(response.name);
        setAbout(response.about);
        setImageFile(response.Profile);
        setImageUrl(newImageUrl); // Update the displayed image URL
      } else {
        setError(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#FAFAFA] flex-col items-center min-h-screen">
      <NavBar />
      <div className="grow flex flex-col justify-center">
        <div className="bg-white rounded-lg text-black shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-black mb-4">Update Profile</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          
          {/* Circle to display the profile image */}
          <div className="flex justify-center mb-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover"
              />
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="about">About</label>
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="image">Profile Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded focus:outline-none ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
