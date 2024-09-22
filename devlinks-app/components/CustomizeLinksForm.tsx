"use client"
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaGithub, FaTwitter, FaLinkedin, FaGlobe, FaLink } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Assuming you have these images in your public folder
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

const LinkItem: React.FC<LinkItemProps> = ({ id, platform, link, onChange, onRemove }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor={`platform-${id}`}>Platform</Label>
          <Button variant="destructive" size="sm" onClick={() => onRemove(id)}>Remove</Button>
        </div>
        <Select value={platform} onValueChange={(value) => onChange(id, "platform", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GitHub">GitHub</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor={`link-${id}`} className="mt-4 block">Link</Label>
        <Input
          id={`link-${id}`}
          value={link}
          onChange={(e) => onChange(id, "link", e.target.value)}
          placeholder="e.g. https://github.com/username"
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
};

const CustomizeLinksForm: React.FC = () => {
  const [links, setLinks] = useState([{ id: 1, platform: "GitHub", link: "" }]);
  const [savedLinks, setSavedLinks] = useState<{ id: number; platform: string; link: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem('profileData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setLinks(parsedData.links || []);
      setSavedLinks(parsedData.savedLinks || []);
      setImage(parsedData.image || null);
      setFirstName(parsedData.firstName || "");
      setLastName(parsedData.lastName || "");
      setEmail(parsedData.email || "");
    }
  }, []);

  const saveToLocalStorage = () => {
    const dataToSave = {
      links,
      savedLinks,
      image,
      firstName,
      lastName,
      email
    };
    localStorage.setItem('profileData', JSON.stringify(dataToSave));
  };

  const handleAddLink = () => {
    const newId = links.length ? Math.max(...links.map((link) => link.id)) + 1 : 1;
    setLinks([...links, { id: newId, platform: "GitHub", link: "" }]);
  };

  const handleRemoveLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleChangeLink = (id: number, field: string, value: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const handleSave = () => {
    setSavedLinks([...links]);
    saveToLocalStorage();
    router.push('/profile/share');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundColor = (platform: string) => {
    switch (platform) {
      case "GitHub": return "bg-black text-white";
      case "Twitter": return "bg-blue-500 text-white";
      case "LinkedIn": return "bg-blue-700 text-white";
      case "Website": return "bg-gray-300 text-black";
      default: return "bg-gray-100 text-black";
    }
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case "GitHub": return <FaGithub />;
      case "Twitter": return <FaTwitter />;
      case "LinkedIn": return <FaLinkedin />;
      case "Website": return <FaGlobe />;
      default: return null;
    }
  };

  const handlePreviewClick = () => {
    saveToLocalStorage();
    router.push('/profile/preview');
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="logo" width={32} height={32} />
          <h1 className="font-bold text-2xl">devlinks</h1>
        </div>
        <Button onClick={handlePreviewClick}>Preview</Button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Preview */}
        <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
          <div className="relative w-[240px] h-[480px] mx-auto">
            <Image src={mob1} alt="Mobile background" layout="fill" objectFit="contain" />
            <div className="absolute inset-0 flex justify-center items-center">
              <Image src={mob2} alt="Mobile foreground" width={220} height={440} />
            </div>
            <div className="absolute inset-y-16 w-full flex flex-col items-center gap-4 p-4 z-20">
              <Avatar className="w-16 h-16">
                <AvatarImage src={image || ""} alt="Profile" />
                <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-sm font-bold">{firstName} {lastName}</h2>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
              {savedLinks.map((link) => (
                <Link
                  href={link.link}
                  key={link.id}
                  className={`flex items-center justify-between w-full p-2 rounded-md ${getBackgroundColor(link.platform)}`}
                >
                  <div className="flex items-center gap-2">
                    {getIcon(link.platform)}
                    <span className="text-xs font-bold">{link.platform}</span>
                  </div>
                  <FaArrowRight className="text-xs" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:w-2/3">
          <Tabs defaultValue="links">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="links"><FaLink className="mr-2" /> Links</TabsTrigger>
              <TabsTrigger value="profile"><CgProfile className="mr-2" /> Profile Details</TabsTrigger>
            </TabsList>

            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle>Customize your links</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleAddLink} className="w-full mb-4">+ Add new link</Button>
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
                  <Button onClick={handleSave} className="w-full mt-4">Save</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-picture">Profile picture</Label>
                      <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                          {image ? (
                            <Avatar className="w-24 h-24">
                              <AvatarImage src={image} alt="Profile" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="text-center">
                              <FaGlobe className="mx-auto h-12 w-12 text-gray-400" />
                              <span className="mt-2 block text-sm font-semibold text-gray-900">
                                Upload image
                              </span>
                            </div>
                          )}
                        </Label>
                        <Input
                          id="profile-picture"
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Appleseed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. email@example.com"
                      />
                    </div>
                    <Button className="w-full" onClick={handleSave}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomizeLinksForm;