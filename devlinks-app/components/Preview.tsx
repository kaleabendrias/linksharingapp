"use client";

import {
  FaArrowRight,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

interface LinkData {
  platform: string;
  link: string;
}

// Utility function to get background color based on platform
const getBackgroundColor = (platform: string) => {
  switch (platform) {
    case "GitHub":
      return "bg-gray-800";
    case "Twitter":
      return "bg-blue-500";
    case "LinkedIn":
      return "bg-blue-700";
    case "Website":
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

// Utility function to get the icon based on platform
const getIcon = (platform: string) => {
  switch (platform) {
    case "GitHub":
      return <FaGithub className="text-white" />;
    case "Twitter":
      return <FaTwitter className="text-white" />;
    case "LinkedIn":
      return <FaLinkedin className="text-white" />;
    case "Website":
      return <FaGlobe className="text-white" />;
    default:
      return <FaLink className="text-white" />;
  }
};

const Preview = () => {
  const searchParams = useSearchParams();
  const imageParam = searchParams.get("image");
  const linksParam = searchParams.get("links");

  const [parsedLinks, setParsedLinks] = useState<LinkData[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (imageParam) {
      setImageSrc(decodeURIComponent(imageParam));
    }
  }, [imageParam]);

  useEffect(() => {
    if (linksParam) {
      try {
        const linksArray = JSON.parse(decodeURIComponent(linksParam));
        setParsedLinks(linksArray);
      } catch (error) {
        console.error("Failed to parse links", error);
      }
    }
  }, [linksParam]);

  return (
    <div className=" flex items-center justify-center w-screen flex-col">
      <div className="relative">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="Profile Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[396px] h-[630px] relative">
            <svg
              className="absolute inset-y-0 inset-x-0 w-full h-full z-10"
              xmlns="http://www.w3.org/2000/svg"
              width="307"
              height="630"
              viewBox="0 0 308 632"
              fill="none"
            >
              <path
                d="M1 54.5C1 24.9528 24.9528 1 54.5 1H253.5C283.047 1 307 24.9528 307 54.5V577.5C307 607.047 283.047 631 253.5 631H54.5C24.9528 631 1 607.047 1 577.5V54.5Z"
                stroke="#737373"
              />
            </svg>

            <svg
              className="absolute inset-y-0 inset-x-0 w-full h-full z-0"
              xmlns="http://www.w3.org/2000/svg"
              width="286"
              height="600"
              viewBox="0 0 286 600"
              fill="none"
            >
              <path
                d="M1 45.5C1 20.9233 20.9233 1 45.5 1H69.5C75.8513 1 81 6.14873 81 12.5C81 20.5081 87.4919 27 95.5 27H190.5C198.508 27 205 20.5081 205 12.5C205 6.14873 210.149 1 216.5 1H240.5C265.077 1 285 20.9233 285 45.5V566.5C285 591.077 265.077 611 240.5 611H45.5C20.9233 611 1 591.077 1 566.5V45.5Z"
                fill="white"
                stroke="#737373"
              />
            </svg>

            <div className="absolute inset-y-32 flex flex-col items-center gap-4 p-4 z-20">
              {parsedLinks.map((link, index) => (
                <Link
                  href={link.link}
                  key={index}
                  className={`flex items-center gap-2 p-4 rounded-md ${getBackgroundColor(
                    link.platform
                  )}`}
                >
                  <div className="flex items-center justify-start mr-8">
                    {getIcon(link.platform)}
                    <div className="flex flex-col">
                      <span className="font-bold">{link.platform}</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-white" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
