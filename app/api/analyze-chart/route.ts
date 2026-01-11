import * as fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path, { join } from "path";
import { UserProfile } from "../../../types/analysisTypes";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;

  try {
    if (!apiKey) {
      throw new Error("Anthropic API key is not set.");
    }

    console.log("Received request to /api/analyze-chart");

    const formData = await request.formData();

    const imageBlob = formData.get("image") as Blob | null;
    const userProfileJson = formData.get("userProfile") as string | null;

    if (!imageBlob) {
      console.error("No image blob in request");
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      );
    }

    // Parse user profile if provided
    let userProfile: UserProfile | null = null;
    if (userProfileJson) {
      try {
        userProfile = JSON.parse(userProfileJson);
      } catch (e) {
        console.error("Failed to parse user profile:", e);
      }
    }

    // Get image data as ArrayBuffer
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file to disk with a unique name
    const tempDir = os.tmpdir();
    const uniqueFilename = `chart-${Date.now()}.${
      imageBlob.type.split("/")[1] || "jpg"
    }`;
    const filepath = join(tempDir, uniqueFilename);

    await writeFile(filepath, buffer);
    console.log("Saved file to:", filepath);

    // Read the file as base64
    const fileBuffer = await readFile(filepath);
    const base64Image = fileBuffer.toString("base64");

    const fileType = imageBlob.type.split("/")[1] || "jpeg";

    let prompt;
    try {
      const promptFilePath = path.join(process.cwd(), "public", "prompt.txt");
      prompt = await readFile(promptFilePath, "utf-8");
    } catch (error) {
      console.error("Error reading prompt file:", error);
      prompt = "Please analyze this trading chart and provide insights.";
    }

    const message = {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\nUser Profile:\n- Experience level: ${
                userProfile?.experienceLevel || "Intermediate"
              }\n- Markets traded: ${
                userProfile?.marketsTraded?.join(", ") || "Crypto"
              }\n- Trading style: ${
                userProfile?.tradingStyle?.join(", ") || "Swing Trading"
              }\n- Strategy preferences: ${
                userProfile?.strategyPreferences?.join(", ") ||
                "Technical Analysis"
              }\n\nIMPORTANT: Please respond with a properly formatted JSON object that follows this TypeScript interface:
              
              export interface AnalysisResult {
                scenarioType: 0 | 1 | 2 | 3;
                message?: string;
                keyInsights?: {
                  trend: {
                    direction: "BULLISH" | "BEARISH" | "NEUTRAL";
                    confidence: number;
                  };
                  volatility: {
                    level: "Above" | "Average" | "Below";
                    context: string;
                  };
                  volume: {
                    level: "Heavy" | "Average" | "Light";
                    details: string;
                  };
                  marketSpecificContext?: string;
                };
                analysisSummary?: string;
                keyPriceLevels?: {
                  currentPrice: number;
                  resistanceLevels: {price: number; description: string;}[];
                  supportLevels: {price: number; description: string;}[];
                  entryZone: {
                    min: number;
                    max: number;
                    type: "long" | "short";
                  };
                  invalidationLevel: {
                    price: number;
                    condition: string;
                  };
                  extendedSRAnalysis?: string;
                };
                tradingInsights?: {
                  marketPhase: string;
                  momentumStatus: string;
                  priceActionSignals: string;
                  volumeConfirmation: string;
                  keyIndicatorSignals?: string;
                  trendStrengthAssessment?: string;
                  summary: string;
                };
                patternRecognition?: {
                  primaryPattern: {
                    name: string;
                    description: string;
                    projectedMove?: string;
                  };
                  additionalPattern?: {
                    name: string;
                    description: string;
                    projectedMove?: string; 
                  };
                  patternConfidence: number;
                  confirmationStatus: "needed" | "confirmed";
                  patternDetails?: string;
                };
                actionableStrategy?: {
                  entryStrategies: {
                    primary: {
                      description: string;
                      level?: number;
                      context: string;
                    };
                    alternative: {
                      description: string;
                      level?: number;
                      context: string;
                    };
                  };
                  entryTriggers: string;
                  styleAlignedApproach?: string;
                  riskManagement: {
                    stopLoss: {
                      level: number;
                      percentage: number;
                    };
                    riskRewardRatio: {
                      ratio: string;
                      assessment: string;
                    };
                  };
                  profitTargets: {
                    target1: {
                      level: number;
                      percentage: number;
                    };
                    target2: {
                      level: number;
                      percentage: number;
                    };
                  };
                  invalidationTrigger: string;
                };
                economicEvents?: {
                  upcomingEvents: {
                    date: string;
                    name: string;
                    impact: "High" | "Medium" | "Low";
                  }[];
                  potentialImpact: string;
                  historicalReaction: string;
                  eventImpactAnalysis?: string;
                };
                educationalNotes?: string;
                personalizedTakeaways?: string[];
              }
              
              Your ENTIRE response should be ONLY the JSON object, with no additional text, explanation, or formatting. If the chart isn't valid for analysis (not a trading chart), set scenarioType to 0 and include a message explaining why.`,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: `image/${fileType}`,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      // signal: AbortSignal.timeout(240000),
      body: JSON.stringify({
        ...message,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const claudeResponse = await response.json();

    let analysisResult;

    // Clean up the temporary file
    try {
      analysisResult = JSON.parse(claudeResponse.content[0].text);

      // Validate that it's a proper AnalysisResult object
      if (!("scenarioType" in analysisResult)) {
        throw new Error("Invalid response format");
      }

      await fs.promises.unlink(filepath);
      console.log("Temporary file cleaned up");
    } catch (error) {
      console.error("Error cleaning up temporary file:", error);
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        message: "Failed to analyze trading chart",
        error: error instanceof Error ? error : "Unknown error",
      },
      { status: 500 }
    );
  }
}
