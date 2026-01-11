"use client";

import { AnalysisResult } from "@/types/analysisTypes";
import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiTrash2,
  FiX,
  FiImage,
} from "react-icons/fi";

interface ChartHistoryProps {
  onSelectHistory: (result: AnalysisResult) => void;
  currentResult: AnalysisResult | null;
  shouldAddToHistory?: boolean;
}

interface HistoryItem {
  id: string;
  date: string;
  result: AnalysisResult;
  imageUrl?: string;
}

const ChartHistory: React.FC<ChartHistoryProps> = ({
  onSelectHistory,
  currentResult,
  shouldAddToHistory = true, // Default to true
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close panel on mobile by default
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("tradingChartHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chart history", e);
        localStorage.removeItem("tradingChartHistory");
      }
    }
  }, []);

  useEffect(() => {
    if (
      currentResult &&
      Object.keys(currentResult).length > 0 &&
      shouldAddToHistory &&
      !isFromHistory
    ) {
      if (currentResult.scenarioType === 0) return;

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        result: currentResult,
        imageUrl: currentResult.imageUrl, // Store the image URL in history
      };

      setHistory((prevHistory) => {
        const isDuplicate = prevHistory.some(
          (item) =>
            JSON.stringify(item.result) === JSON.stringify(currentResult)
        );

        if (isDuplicate) {
          return prevHistory; // Don't add duplicate
        }

        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 10);
        localStorage.setItem(
          "tradingChartHistory",
          JSON.stringify(updatedHistory)
        );
        return updatedHistory;
      });
    }

    if (isFromHistory) {
      setIsFromHistory(false);
    }
  }, [currentResult, shouldAddToHistory, isFromHistory]);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your trading chart history?")) {
      localStorage.removeItem("tradingChartHistory");
      setHistory([]);
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem("tradingChartHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleSelectHistory = (result: AnalysisResult) => {
    setIsFromHistory(true);
    onSelectHistory(result);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScenarioLabel = (scenarioType: number) => {
    switch (scenarioType) {
      case 1:
        return "Single instrument";
      case 2:
        return "Multiple timeframes";
      case 3:
        return "Multiple instruments";
      default:
        return "Unknown";
    }
  };

  const getTrendClass = (direction: string) => {
    switch (direction) {
      case "BULLISH":
        return "text-green-400";
      case "BEARISH":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
      <div
        className="flex justify-between items-center p-3 cursor-pointer bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FiClock className="text-blue-400 mr-2" />
          <h2 className="font-medium">Trading Chart History</h2>
          <span className="ml-2 text-sm bg-blue-900 text-blue-400 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {isOpen && (
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-400">
              {history.length} {history.length === 1 ? "chart" : "charts"} in
              history
            </p>
            <button
              onClick={clearHistory}
              className="text-xs flex items-center text-gray-400 hover:text-red-400"
            >
              <FiTrash2 className="mr-1" /> Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectHistory(item.result)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  currentResult &&
                  JSON.stringify(currentResult) === JSON.stringify(item.result)
                    ? "bg-blue-900 bg-opacity-30 border border-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {getScenarioLabel(item.result.scenarioType)}
                      </span>

                      {item.result.keyInsights?.trend && (
                        <span
                          className={`ml-2 text-xs font-medium ${getTrendClass(
                            item.result.keyInsights.trend.direction
                          )}`}
                        >
                          {item.result.keyInsights.trend.direction}
                          <span className="text-gray-400 ml-1">
                            ({item.result.keyInsights.trend.confidence}%)
                          </span>
                        </span>
                      )}
                    </div>

                    {item.result.keyPriceLevels && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-400">Price:</span> $
                        {item.result.keyPriceLevels.currentPrice}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimestamp(item?.date || new Date().toISOString())}
                    </div>
                  </div>

                  <button
                    onClick={(e) => removeHistoryItem(e, item.id)}
                    className="text-gray-500 hover:text-red-400 p-1"
                    aria-label="Remove from history"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Chart Thumbnail */}
                {item.result.imageUrl && (
                  <div className="mt-2 border border-gray-600 rounded overflow-hidden h-20">
                    <img
                      src={item.result.imageUrl}
                      alt="Chart thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {!item.result.imageUrl && (
                  <div className="mt-2 border border-gray-600 rounded overflow-hidden h-20 flex items-center justify-center bg-gray-800">
                    <FiImage size={24} className="text-gray-500" />
                    <span className="text-gray-500 text-xs ml-2">
                      No image available
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartHistory;
