import { UserProfile } from "@/types/analysisTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";

interface ProfileSetupProps {
  onProfileSet: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileSet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveProfile = (profile: UserProfile) => {
    onProfileSet(profile);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full overflow-hidden w-32 h-32 border-4 border-blue-500">
            <Image
              src="/images/defaultProfile.jpg"
              alt="Default profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          Welcome to AI Trading Analysis
        </h1>
        <p className="text-gray-300 mb-6">
          Please set up your trader profile to get personalized analysis
          tailored to your trading style and preferences.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium"
        >
          Set Up My Profile
        </button>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfileSetup;
