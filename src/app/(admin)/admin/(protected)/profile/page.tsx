"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  RefreshCcw, 
  Save,
  User as UserIcon
} from "lucide-react";
import type { UserData } from "@/lib/data";
import {
  SectionHeader,
  Input,
  Textarea,
  Button,
  SecondaryButton,
  Alert,
} from "@/components/admin/AdminUIComponents";
import { ImageUpload, DocumentUpload, uploadFileToSupabase } from "@/components/admin/FileUpload";

const defaultProfileState: UserData = {
  full_name: "",
  email: "",
  bio: "",
  title: "",
  location: "",
  profile_image_url: "",
  github_url: "",
  linkedin_url: "",
  resume_url: "",
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserData>(defaultProfileState);
  const [profileForm, setProfileForm] = useState<UserData>(defaultProfileState);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Store pending files
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(null);
  const [pendingResume, setPendingResume] = useState<File | null>(null);

  const loadData = async () => {
    try {
      const profileData = await fetchJson<UserData>("/api/portfolio/user");
      setProfile(profileData);
      setProfileForm(profileData ?? defaultProfileState);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);
    setIsSaving(true);

    try {
      // Create a copy of the form data to modify
      const dataToSave = { ...profileForm };

      // Upload pending files first
      if (pendingProfileImage) {
        setProfileMessage("Uploading profile image...");
        const url = await uploadFileToSupabase(pendingProfileImage, "images/profiles");
        dataToSave.profile_image_url = url;
        setPendingProfileImage(null);
      }

      if (pendingResume) {
        setProfileMessage("Uploading resume...");
        const url = await uploadFileToSupabase(pendingResume, "documents/resumes");
        dataToSave.resume_url = url;
        setPendingResume(null);
      }

      setProfileMessage("Saving profile...");
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update profile");
      }

      setProfileMessage("Profile updated successfully!");
      await loadData();
    } catch (error) {
      console.error(error);
      setProfileMessage(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            className="inline-block h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Profile" 
          description="Update your personal information and outbound links." 
          icon={UserIcon}
        />
        
        <AnimatePresence mode="wait">
          {profileMessage && (
            <Alert 
              message={profileMessage} 
              onClose={() => setProfileMessage("")} 
            />
          )}
        </AnimatePresence>
        {/* Profile Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Preview</h3>
          <div className="flex items-start gap-4">
            {profileForm.profile_image_url && (
              <Image
                src={profileForm.profile_image_url}
                alt={profileForm.full_name || "Profile"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-200"
              />
            )}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-900">{profileForm.full_name || "Your Name"}</h4>
              <p className="text-sm text-teal-600 font-medium">{profileForm.title || "Your Title"}</p>
              <p className="text-sm text-slate-600 mt-1">{profileForm.location || "Location"}</p>
              <p className="text-sm text-slate-700 mt-2">{profileForm.bio || "Your bio will appear here..."}</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Image at Top Center */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md">
                <ImageUpload
                  label="Profile Image"
                  currentFile={profileForm.profile_image_url ?? ""}
                  onFileSelect={(fileOrUrl) => {
                    if (fileOrUrl instanceof File) {
                      setPendingProfileImage(fileOrUrl);
                    } else {
                      setProfileForm((prev) => ({ ...prev, profile_image_url: fileOrUrl }));
                    }
                  }}
                  onFileRemove={() => {
                    setPendingProfileImage(null);
                    setProfileForm((prev) => ({ ...prev, profile_image_url: "" }));
                  }}
                  directory="images/profiles"
                  description="Upload your profile picture (JPG, PNG, or WebP)"
                  maxSize={10}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                value={profileForm.full_name ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, full_name: value }))}
              />
              <Input
                label="Professional title"
                value={profileForm.title ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, title: value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email"
                value={profileForm.email ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))}
              />
              <Input
                label="Location"
                value={profileForm.location ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, location: value }))}
              />
            </div>
            <Textarea
              label="Bio"
              rows={5}
              value={profileForm.bio ?? ""}
              onChange={(value) => setProfileForm((prev) => ({ ...prev, bio: value }))}
            />
            
            {/* Resume Upload */}
            <div className="max-w-md">
              <DocumentUpload
                label="Resume"
                currentFile={profileForm.resume_url ?? ""}
                onFileSelect={(fileOrUrl) => {
                  if (fileOrUrl instanceof File) {
                    setPendingResume(fileOrUrl);
                  } else {
                    setProfileForm((prev) => ({ ...prev, resume_url: fileOrUrl }));
                  }
                }}
                onFileRemove={() => {
                  setPendingResume(null);
                  setProfileForm((prev) => ({ ...prev, resume_url: "" }));
                }}
                directory="documents/resumes"
                description="Upload your resume (PDF format)"
                maxSize={10}
              />
            </div>

            {/* Optional: Manual URL Entry */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 mb-2 list-none flex items-center gap-2">
                <span className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
                Advanced: Manual URL Entry
              </summary>
              <div className="grid gap-4 md:grid-cols-2 mt-4 pl-6 border-l-2 border-teal-200 bg-slate-50/50 rounded-r-xl p-4">
                <Input
                  label="Profile image URL"
                  value={profileForm.profile_image_url ?? ""}
                  onChange={(value) =>
                    setProfileForm((prev) => ({ ...prev, profile_image_url: value }))
                  }
                  placeholder="https://..."
                />
                <Input
                  label="Resume URL"
                  value={profileForm.resume_url ?? ""}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, resume_url: value }))}
                  placeholder="https://..."
                />
              </div>
            </details>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="GitHub URL"
                value={profileForm.github_url ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, github_url: value }))}
              />
              <Input
                label="LinkedIn URL"
                value={profileForm.linkedin_url ?? ""}
                onChange={(value) => setProfileForm((prev) => ({ ...prev, linkedin_url: value }))}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                type="submit" 
                icon={<Save className="h-4 w-4" />}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save profile"}
              </Button>
              {!isSaving && (
                <SecondaryButton
                  type="button"
                  icon={<RefreshCcw className="h-4 w-4" />}
                  onClick={() => {
                    setProfileForm(profile ?? defaultProfileState);
                    setPendingProfileImage(null);
                    setPendingResume(null);
                  }}
                >
                  Reset
                </SecondaryButton>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
