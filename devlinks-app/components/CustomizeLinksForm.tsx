"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import logo from "../public/logo.png";
import mob1 from "../public/image (5).png";
import mob2 from "../public/image (6).png";

interface LinkItemProps {
  id: number;
  platform: string;
  link: string;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({
  id,
  platform,
  link,
  onChange,
  onRemove,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <label
          htmlFor={`platform-${id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Platform
        </label>
        <button
          type="button"
          className="text-red-500"
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
      </div>
      <select
        id={`platform-${id}`}
        value={platform}
        onChange={(e) => onChange(id, "platform", e.target.value)}
        className="block w-full p-2 border rounded-md shadow-sm"
      >
        <option value="GitHub">GitHub</option>
        <option value="Twitter">Twitter</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Website">Website</option>
      </select>
      <label
        htmlFor={`link-${id}`}
        className="block text-sm font-medium text-gray-700"
      >
        Link
      </label>
      <input
        type="url"
        id={`link-${id}`}
        value={link}
        onChange={(e) => onChange(id, "link", e.target.value)}
        className="block w-full p-2 border rounded-md shadow-sm"
        placeholder="e.g. https://github.com/username"
      />
    </div>
  );
};

const CustomizeLinksForm: React.FC = () => {
  const [links, setLinks] = useState([{ id: 1, platform: "GitHub", link: "" }]);
  const [savedLinks, setSavedLinks] = useState<
    { id: number; platform: string; link: string }[]
  >([]);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const handleAddLink = () => {
    const newId = links.length
      ? Math.max(...links.map((link) => link.id)) + 1
      : 1;
    setLinks([...links, { id: newId, platform: "GitHub", link: "" }]);
  };

  const handleRemoveLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleChangeLink = (id: number, field: string, value: string) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const handleSave = () => {
    setSavedLinks([...links]);
  };

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
        return <FaGithub className="text-white" />;
      case "Twitter":
        return <FaTwitter className="text-white" />;
      case "LinkedIn":
        return <FaLinkedin className="text-white" />;
      case "Website":
        return <FaGlobe className="text-black" />;
      default:
        return null;
    }
  };

  const [activeSection, setActiveSection] = useState<"Profile" | "Link">(
    "Profile"
  );

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const queryParams = new URLSearchParams();
  queryParams.set("image", image || "");
  queryParams.set("links", JSON.stringify(links || []));
  const handlePreviewClick = () => {
    router.push(`/profile/preview?${queryParams.toString()}`);
  };

  return (
    <div className="p-8 flex flex-col gap-y-8">
      {/* Navbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="logo" className="h-[32] w-[32]" />
          <p className="font-bold text-2xl">devlinks</p>
        </div>
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-2 p-2 rounded-md ${
              activeSection === "Link" ? "bg-gray-200" : "bg-gray-100"
            }`}
            onClick={() => setActiveSection("Link")}
          >
            <FaLink />
            <span>Link</span>
          </button>
          <button
            className={`flex items-center gap-2 p-2 rounded-md ${
              activeSection === "Profile" ? "bg-gray-200" : "bg-gray-100"
            }`}
            onClick={() => setActiveSection("Profile")}
          >
            <CgProfile />
            <span className="text-[#633CFF]">Profile Details</span>
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 border-2 border-[#633CFF] rounded-md flex items-center"
            onClick={handlePreviewClick}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeSection === "Profile" ? (
        <div className="w-screen p-8 ">
          <div className="flex flex-col lg:flex-row items-center justify-start">
            <div className="relative flex items-center justify-start p-2 top-0">
              <div className="relative w-[396] h-[630] top-0">
                <Image
                  src={mob1}
                  alt="bg mobile"
                  layout="fill"
                  objectFit="contain"
                />
                <div className="absolute inset-0 flex justify-center items-center p-2">
                  <Image src={mob2} alt="mob" width={260} height={520} />
                </div>
              </div>

              <div className="w-full absolute inset-y-32 flex flex-col items-center gap-4 p-4 z-20">
                {savedLinks.map((link) => (
                  <Link
                    href={link.link}
                    key={link.id}
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
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
              <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
              <p className="mb-4">
                Add your details to create a personal touch to your profile.
              </p>

              <div className=" m-6 bg-gray-100 flex items-center justify-between space-x-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Profile picture
                </label>
                <div className="border border-dashed bg-gray-300 rounded-lg p-24 flex justify-center items-center flex-col">
                  {image ? (
                    <Image
                      src={image}
                      alt="Profile"
                      className="w-40 rounded-full mb-4"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <label
                      htmlFor="profile-picture"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M33.75 6.25H6.25C5.58696 6.25 4.95107 6.51339 4.48223 6.98223C4.01339 7.45107 3.75 8.08696 3.75 8.75V31.25C3.75 31.913 4.01339 32.5489 4.48223 33.0178C4.95107 33.4866 5.58696 33.75 6.25 33.75H33.75C34.413 33.75 35.0489 33.4866 35.5178 33.0178C35.9866 32.5489 36.25 31.913 36.25 31.25V8.75C36.25 8.08696 35.9866 7.45107 35.5178 6.98223C35.0489 6.51339 34.413 6.25 33.75 6.25ZM33.75 8.75V24.8047L29.6766 20.7328C29.4444 20.5006 29.1688 20.3164 28.8654 20.1907C28.5621 20.0651 28.2369 20.0004 27.9086 20.0004C27.5802 20.0004 27.2551 20.0651 26.9518 20.1907C26.6484 20.3164 26.3728 20.5006 26.1406 20.7328L23.0156 23.8578L16.1406 16.9828C15.6718 16.5143 15.0362 16.2512 14.3734 16.2512C13.7107 16.2512 13.075 16.5143 12.6062 16.9828L6.25 23.3391V8.75H33.75ZM6.25 26.875L14.375 18.75L26.875 31.25H6.25V26.875ZM33.75 31.25H30.4109L24.7859 25.625L27.9109 22.5L33.75 28.3406V31.25ZM22.5 15.625C22.5 15.2542 22.61 14.8916 22.816 14.5833C23.022 14.275 23.3149 14.0346 23.6575 13.8927C24.0001 13.7508 24.3771 13.7137 24.7408 13.786C25.1045 13.8584 25.4386 14.037 25.7008 14.2992C25.963 14.5614 26.1416 14.8955 26.214 15.2592C26.2863 15.6229 26.2492 15.9999 26.1073 16.3425C25.9654 16.6851 25.725 16.978 25.4167 17.184C25.1084 17.39 24.7458 17.5 24.375 17.5C23.8777 17.5 23.4008 17.3025 23.0492 16.9508C22.6975 16.5992 22.5 16.1223 22.5 15.625Z"
                          fill="#633CFF"
                        />
                      </svg>

                      <span className="text-purple-600">+ Upload Image</span>
                    </label>
                  )}
                  <input
                    type="file"
                    id="profile-picture"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                </p>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="first-name"
                >
                  First name*
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="e.g. John"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="last-name"
                >
                  Last name*
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="e.g. Appleseed"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. email@example.com"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="flex items-center justify-start p-2 top-0">
                <div className="relative w-[396] h-[630] top-0">
                  <Image
                    src={mob1}
                    alt="bg mobile"
                    layout="fill"
                    objectFit="contain"
                  />
                  <div className="absolute inset-0 flex justify-center items-center p-2">
                    <Image src={mob2} alt="mob" width={260} height={520} />
                  </div>
                </div>
              </div>

              <div className="w-full absolute inset-y-32 flex flex-col items-center gap-4 p-4 z-20">
                {savedLinks.map((link) => (
                  <Link
                    href={link.link}
                    key={link.id}
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

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Customize your links</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
            <button
              type="button"
              className="mb-4 px-4 py-2 border rounded-md border-purple-600 text-purple-600 hover:bg-purple-100"
              onClick={handleAddLink}
            >
              + Add new link
            </button>
            <div className="space-y-4">
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  id={link.id}
                  platform={link.platform}
                  link={link.link}
                  onChange={handleChangeLink}
                  onRemove={handleRemoveLink}
                />
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizeLinksForm;
