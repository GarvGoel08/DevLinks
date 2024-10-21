"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GithubImage from "../../images/icon-github.svg";
import YoutubImage from "../../images/icon-youtube.svg";
import FaceBookImage from "../../images/icon-facebook.svg";
import LinkedinImage from "../../images/icon-linkedin.svg";
import Image from "next/image";
import twitterImage from "../../images/icon-twitter.svg";
import gitLabImage from '../../images/icon-gitlab.svg';
import twitchImage from '../../images/icon-twitch.svg';

const CardPage = () => {
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
  const { code } = useParams();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!code) return;

      try {
        const response = await fetch(`/api/user/profile?code=${code}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);

        if (data.Links) {
          const fetchedLinks = data.Links;
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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [code]);

  if (!user) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center w-full max-w-4xl p-12 py-8 mx-auto mt-10 bg-white rounded-lg shadow-md">
        <img
          src={user.Profile || "/default-profile.png"} // Fallback profile image
          alt={`${user.name}'s profile`}
          className="w-24 h-24 rounded-full border border-gray-300 mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 text-center">{user.name}</h1>
        <p className="text-gray-600 text-center">{user.about}</p>
        <h2 className="mt-6 text-gray-600 text-lg font-semibold">Links:</h2>
        <div className="flex flex-col w-full mt-2">
          {links.length > 0 ? (
            (console.log(links),
            links.map((link, index) => (
              <a
                key={link.id}
                style={{ backgroundColor: link.platform.color }}
                className={`flex flex-row justify-between items-center p-4 mb-2  rounded-lg shadow-sm`}
                href={link.url}
              >
                <span
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white "
                >
                  {link.platform.name}
                </span>
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
              </a>
            )))
          ) : (
            <p>No links available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
