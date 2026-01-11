import Image from "next/image";
import React from "react";
import {
  FiBarChart2,
  FiClock,
  FiEdit,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { UserProfile as UserProfileType } from "../../types/analysisTypes";

interface UserProfileProps {
  profile: UserProfileType | null;
  onEditProfile: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onEditProfile,
}) => {
  if (!profile) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <FiUser className="mr-2" /> Trader Profile
        </h2>
        <button
          onClick={onEditProfile}
          className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
        >
          <FiEdit className="mr-1" /> Edit
        </button>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="rounded-full overflow-hidden w-24 h-24 mb-3 border-2 border-blue-500">
          <Image
            src="/images/defaultProfile.jpg"
            alt="User profile"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-gray-400 text-sm">Experience Level</h3>
          <p className="font-medium">{profile.experienceLevel}</p>
        </div>

        <div>
          <h3 className="text-gray-400 text-sm flex items-center">
            <FiBarChart2 className="mr-1" /> Markets Traded
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.marketsTraded.map((market) => (
              <span
                key={market}
                className="bg-blue-900 bg-opacity-50 text-blue-300 px-2 py-1 rounded text-xs"
              >
                {market}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 text-sm flex items-center">
            <FiClock className="mr-1" /> Trading Style
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.tradingStyle.map((style) => (
              <span
                key={style}
                className="bg-purple-900 bg-opacity-50 text-purple-300 px-2 py-1 rounded text-xs"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-400 text-sm flex items-center">
            <FiTrendingUp className="mr-1" /> Strategy Preferences
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.strategyPreferences.map((strategy) => (
              <span
                key={strategy}
                className="bg-green-900 bg-opacity-50 text-green-300 px-2 py-1 rounded text-xs"
              >
                {strategy}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
