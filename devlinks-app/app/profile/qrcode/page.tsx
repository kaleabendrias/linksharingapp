"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import { auth } from "@/firebase";
import * as htmlToImage from "html-to-image";

type Link = {
  _id: string;
  platform: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v: number;
};

type ProfileData = {
  links: Link[];
};

const QRCodeProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeValue, setQRCodeValue] = useState<string>("");
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const getIdToken = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken();
        return idToken;
      } catch (error) {
        console.error("Error getting ID token:", error);
        throw new Error("Unable to retrieve ID token");
      }
    } else {
      throw new Error("No user is currently signed in");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No authenticated user found");
        }

        const response = await fetch("https://linksharingapp-back.vercel.app/api/links", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getIdToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setProfileData({ links: data });

        // Generate QR code value
        const qrData = data
          .map((link: Link) => `${link.platform}: ${link.link}`)
          .join("\n");
        setQRCodeValue(qrData);
      } catch (err) {
        setError("Error fetching profile data. Please try again later.");
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfileData();
      } else {
        setError("No authenticated user found. Please sign in.");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
        return <FaLink />;
    }
  };

  const handleDownloadQRCode = async () => {
    if (qrCodeRef.current) {
      const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qrcode.png";
      link.click();
    }
  };

  const handleCopyQRCode = async () => {
    if (qrCodeRef.current) {
      try {
        const blob = await htmlToImage.toBlob(qrCodeRef.current);
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert("QR code copied to clipboard!");
        }
      } catch (error) {
        console.error("Failed to copy image:", error);
        alert("Failed to copy image to clipboard.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>

          <div className="flex flex-col items-center mb-6">
            {/* QR Code container */}
            <div ref={qrCodeRef}>
              <QRCodeSVG value={qrCodeValue} size={200} />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleDownloadQRCode}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Download QR Code
              </button>

              <button
                onClick={handleCopyQRCode}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Copy QR Code
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {profileData.links.map((link) => (
              <a
                key={link._id}
                href={`https://${link.platform.toLowerCase()}.com/${link.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center">
                  {getIcon(link.platform)}
                  <span className="ml-3 font-medium">{link.platform}</span>
                </div>
                <span className="text-sm text-gray-500">{link.link}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeProfilePage;
