import { UserProfile } from "@/types/analysisTypes";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

// Default options for dropdowns and checkboxes
const experienceLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];
const marketOptions = [
  "Stocks",
  "Forex",
  "Crypto",
  "Futures",
  "Options",
  "Commodities",
];
const tradingStyleOptions = [
  "Day Trading",
  "Swing Trading",
  "Position Trading",
  "Scalping",
  "Algorithmic Trading",
];
const strategyOptions = [
  "Technical Analysis",
  "Fundamental Analysis",
  "Price Action",
  "Pattern-Based Trading",
  "Trend Following",
  "Momentum Trading",
  "Breakout Trading",
  "Mean Reversion",
];

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      experienceLevel: "Beginner",
      marketsTraded: [],
      tradingStyle: [],
      strategyPreferences: [],
    }
  );

  const handleExperienceChange = (level: string) => {
    setProfile({ ...profile, experienceLevel: level });
  };

  const handleToggleOption = (
    option: string,
    field: keyof Pick<
      UserProfile,
      "marketsTraded" | "tradingStyle" | "strategyPreferences"
    >
  ) => {
    if (profile[field].includes(option)) {
      setProfile({
        ...profile,
        [field]: profile[field].filter((item) => item !== option),
      });
    } else {
      setProfile({
        ...profile,
        [field]: [...profile[field], option],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Your Trader Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Experience Level</label>
            <div className="grid grid-cols-2 gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`py-2 px-4 rounded ${
                    profile.experienceLevel === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleExperienceChange(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Markets Traded</label>
            <div className="grid grid-cols-2 gap-2">
              {marketOptions.map((market) => (
                <div
                  key={market}
                  className={`py-2 px-4 rounded cursor-pointer ${
                    profile.marketsTraded.includes(market)
                      ? "bg-blue-900 bg-opacity-50 text-blue-300 border border-blue-500"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleToggleOption(market, "marketsTraded")}
                >
                  {market}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Trading Style</label>
            <div className="grid grid-cols-2 gap-2">
              {tradingStyleOptions.map((style) => (
                <div
                  key={style}
                  className={`py-2 px-4 rounded cursor-pointer ${
                    profile.tradingStyle.includes(style)
                      ? "bg-purple-900 bg-opacity-50 text-purple-300 border border-purple-500"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleToggleOption(style, "tradingStyle")}
                >
                  {style}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Strategy Preferences
            </label>
            <div className="grid grid-cols-2 gap-2">
              {strategyOptions.map((strategy) => (
                <div
                  key={strategy}
                  className={`py-2 px-4 rounded cursor-pointer ${
                    profile.strategyPreferences.includes(strategy)
                      ? "bg-green-900 bg-opacity-50 text-green-300 border border-green-500"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() =>
                    handleToggleOption(strategy, "strategyPreferences")
                  }
                >
                  {strategy}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 mr-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
