"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaLink,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaArrowLeft,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Assuming you have this image in your public folder
import logo from "../public/logo.png";

// Define types for the links and profile data
type LinkData = {
  id: string;
  platform: string;
  link: string;
};

type ProfileData = {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  links: LinkData[];
};

const ShareProfilePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  // Initialize state with ProfileData type
  const [profileData, setProfileData] = useState<ProfileData>({
    image: "",
    firstName: "",
    lastName: "",
    email: "",
    links: [],
  });
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    const storedProfileData = localStorage.getItem("profileData");
    if (storedProfileData) {
      setProfileData(JSON.parse(storedProfileData));
    }

    const uniqueId = localStorage.getItem("profileId") || Math.random().toString(36).substr(2, 9);
    localStorage.setItem("profileId", uniqueId);
    setProfileUrl(`${window.location.origin}/profile/${uniqueId}`);
  }, []);

  const getIcon = (platform: string): JSX.Element => {
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
        return <FaLink />;
    }
  };

  const getBackgroundColor = (platform: string): string => {
    switch (platform) {
      case "GitHub": return "bg-black text-white";
      case "Twitter": return "bg-blue-500 text-white";
      case "LinkedIn": return "bg-blue-700 text-white";
      case "Website": return "bg-gray-300 text-black";
      default: return "bg-gray-100 text-black";
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(profileUrl).then(
      () => {
        toast({
          title: "Link copied!",
          description: "Your profile link has been copied to the clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="logo" width={32} height={32} />
          <h1 className="font-bold text-2xl">devlinks</h1>
        </div>
        <Button variant="outline" onClick={() => router.push('/')}>
          Back to Editor
        </Button>
      </header>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={profileData.image} alt="Profile" />
              <AvatarFallback>
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600">{profileData.email}</p>
          </div>

          <div className="space-y-4">
            {profileData.links.map((link) => (
              <a
                key={link.id}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-3 rounded-md hover:opacity-80 transition-opacity ${getBackgroundColor(link.platform)}`}
              >
                <div className="flex items-center">
                  {getIcon(link.platform)}
                  <span className="ml-3 font-medium">{link.platform}</span>
                </div>
                <FaArrowLeft className="transform rotate-180" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Share your profile</h3>
          <div className="flex space-x-2">
            <Input value={profileUrl} readOnly />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareProfilePage;
