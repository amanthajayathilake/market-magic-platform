"use client";

import AnalysisDisplay from "@/components/shared/AnalysisDisplay";
import ChartHistory from "@/components/shared/ChartHistory";
import ImageUploader from "@/components/shared/ImageUploader";
import ProfileModal from "@/components/shared/ProfileModal";
import ProfileSetup from "@/components/shared/ProfileSetup";
import UserProfile from "@/components/shared/UserProfile";
import { uploadToSupabase } from "@/libs/s3Client";
import {
  AnalysisResult,
  UserProfile as UserProfileType,
} from "@/types/analysisTypes";
import { Loader } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const USER_PROFILE_KEY = "ai_trading_user_profile";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // Store current image URL
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading";
        return prev + ".";
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Immediately try to load the profile
    loadUserProfile();

    // Safety timeout as a fallback in case something goes wrong
    const safetyTimeout = setTimeout(() => {
      if (!isProfileLoaded) {
        console.warn("Profile loading timed out, forcing completion");
        setIsProfileLoaded(true);
      }
    }, 5000);

    return () => clearTimeout(safetyTimeout);
  }, [isProfileLoaded]);

  const loadUserProfile = () => {
    try {
      if (typeof window !== "undefined") {
        const storedProfile = localStorage.getItem(USER_PROFILE_KEY);

        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            setUserProfile(parsedProfile);
          } catch (parseErr) {
            console.error("Failed to parse stored profile:", parseErr);
            localStorage.removeItem(USER_PROFILE_KEY);
          }
        } else {
          router.push("/signin");
        }

        setTimeout(() => {
          setIsProfileLoaded(true);
        }, 2000);
      }
    } catch (err) {
      toast.error("Error loading your profile");
      setTimeout(() => {
        setIsProfileLoaded(true);
      }, 2000);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSaveProfile = (profile: UserProfileType) => {
    setUserProfile(profile);

    try {
      if (typeof window !== "undefined") {
        // localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        toast.success("User profile saved successfully");
      }
    } catch (err) {
      toast.error("Error saving user profile:", err);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentImageUrl(null);

    try {
      if (!file.type.startsWith("image/")) {
        toast.error(
          "Sorry, we only accept image files containing trading charts"
        );
        setIsLoading(false);
        return;
      }

      console.log("Preparing to upload file:", file.name, file.type, file.size);

      // Upload to Supabase storage first
      let imageUrl = null;
      try {
        imageUrl = await uploadToSupabase(file);
        setCurrentImageUrl(imageUrl); // Save the URL for display and history
        console.log("File uploaded to Supabase successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Supabase upload error:", uploadError);
        toast.error(
          "Failed to upload image to storage. Analysis will continue."
        );
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userProfile", JSON.stringify(userProfile || {}));
      if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      console.log("Sending request to /api/analyze-chart", formData);

      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received analysis result:", data.scenarioType);

      if (data.scenarioType === 0) {
        toast.error(
          data.message ||
            "Sorry, we only accept image files containing trading charts"
        );
      } else {
        // Add imageUrl to the analysis result
        data.imageUrl = imageUrl;
        setAnalysisResult(data);
      }
    } catch (err) {
      toast.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentImageUrl(result?.imageUrl || null);
    setError(null);
  };

  if (isProfileLoaded && !userProfile) {
    return <ProfileSetup onProfileSet={handleSaveProfile} />;
  }

  if (!isProfileLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Outer glowing circle */}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-md animate-pulse"></div>

          {/* Spinner */}
          <div className="relative bg-gray-800 rounded-full p-6 shadow-lg">
            <Loader className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
        </div>

        <div className="mt-8 text-white text-xl font-medium tracking-wider">
          {loadingText}
        </div>

        <div className="mt-2 text-gray-400 text-sm">
          Please wait while we load your profile
        </div>

        {/* Loading progress bar */}
        <div className="w-64 h-1 mt-6 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-loading-progress"></div>
        </div>
      </div>
    );
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBackdropClick = (e: { target: any; currentTarget: any }) => {
    if (e.target === e.currentTarget) {
      setIsZoomed(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>AI Trading Analysis</title>
        <meta name="description" content="AI-powered trading chart analysis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          AI Trading Analysis
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserProfile
              profile={userProfile}
              onEditProfile={() => setIsProfileModalOpen(true)}
            />
            <ChartHistory
              onSelectHistory={handleSelectHistory}
              currentResult={analysisResult}
            />
          </div>

          <div className="md:col-span-3">
            {!analysisResult && (
              <ImageUploader
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                error={error}
              />
            )}

            {analysisResult && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setCurrentImageUrl(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
                >
                  Upload Another Chart
                </button>

                {/* Display the uploaded chart image */}
                {currentImageUrl && (
                  <div className="relative">
                    {/* Original image container */}
                    <div className="mb-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2 text-white">
                          Uploaded Chart
                        </h3>
                        <div
                          className="relative h-64 w-full overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02] duration-300"
                          onClick={toggleZoom}
                        >
                          <img
                            src={currentImageUrl}
                            alt="Trading Chart"
                            className="object-contain w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
                            <div className="text-white bg-black bg-opacity-50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line
                                  x1="21"
                                  y1="21"
                                  x2="16.65"
                                  y2="16.65"
                                ></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Zoomed image overlay */}
                    {isZoomed && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
                        onClick={handleBackdropClick}
                      >
                        <div className="relative max-w-6xl max-h-full">
                          <button
                            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors z-10"
                            onClick={() => setIsZoomed(false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                          <div className="bg-gray-900 p-2 rounded-lg">
                            <img
                              src={currentImageUrl}
                              alt="Trading Chart"
                              className="max-h-screen max-w-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <AnalysisDisplay analysis={analysisResult} />
              </div>
            )}
          </div>
        </div>
      </main>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfile={userProfile}
      />
    </div>
  );
}
