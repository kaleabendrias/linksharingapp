"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaArrowRight,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import BackToHome from "./BackToHome";

interface FormData {
  links: Array<{ id: number; platform: string; link: string }>;
  image: string | null;
  firstName: string;
  lastName: string;
  email: string;
}

const Preview = () => {
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("profileData"); // Changed from 'formData' to 'profileData'
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, []);

  if (!formData) {
    return <div>Loading...</div>;
  }

  const getBackgroundColor = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return "bg-black text-white";
      case "Twitter":
        return "bg-blue-500 text-white";
      case "LinkedIn":
        return "bg-blue-700 text-white";
      case "Website":
        return "bg-gray-300 text-black";
      default:
        return "bg-gray-100 text-black";
    }
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return <FaGithub />;
      case "Twitter":
        return <FaTwitter />;
      case "LinkedIn":
        return <FaLinkedin />;
      case "Website":
        return <FaGlobe />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start p-4">
        <BackToHome />
      </div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center p-6 bg-gray-100">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={formData.image || ""} alt="Profile" />
            <AvatarFallback>
              {formData.firstName[0]}
              {formData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-semibold">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>
        <div className="p-6">
          {formData.links.map((link) => (
            <a
              href={link.link}
              key={link.id}
              className={`flex items-center justify-between p-3 mb-3 rounded-md ${getBackgroundColor(
                link.platform
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                {getIcon(link.platform)}
                <span className="ml-3 font-medium">{link.platform}</span>
              </div>
              <FaArrowRight />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
