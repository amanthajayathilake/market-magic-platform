export interface KeyInsight {
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
}

export interface PriceLevel {
  price: number;
  description: string;
}

export interface KeyPriceLevels {
  currentPrice: number;
  resistanceLevels: PriceLevel[];
  supportLevels: PriceLevel[];
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
}

export interface TradingInsight {
  marketPhase: string;
  momentumStatus: string;
  priceActionSignals: string;
  volumeConfirmation: string;
  keyIndicatorSignals?: string;
  trendStrengthAssessment?: string;
  summary: string;
}

export interface Pattern {
  name: string;
  description: string;
  projectedMove?: string;
}

export interface PatternRecognition {
  primaryPattern: Pattern;
  additionalPattern?: Pattern;
  patternConfidence: number;
  confirmationStatus: "needed" | "confirmed";
  patternDetails?: string;
}

export interface EntryStrategy {
  description: string;
  level?: number;
  context: string;
}

export interface ActionableStrategy {
  entryStrategies: {
    primary: EntryStrategy;
    alternative: EntryStrategy;
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
}

export interface EconomicEvent {
  date: string;
  name: string;
  impact: "High" | "Medium" | "Low";
}

export interface EconomicEvents {
  upcomingEvents: EconomicEvent[];
  potentialImpact: string;
  historicalReaction: string;
  eventImpactAnalysis?: string;
}

export interface AnalysisResult {
  scenarioType: 0 | 1 | 2 | 3;
  message?: string;
  keyInsights?: KeyInsight;
  analysisSummary?: string;
  keyPriceLevels?: KeyPriceLevels;
  tradingInsights?: TradingInsight;
  patternRecognition?: PatternRecognition;
  actionableStrategy?: ActionableStrategy;
  economicEvents?: EconomicEvents;
  educationalNotes?: string;
  personalizedTakeaways?: string[];
  imageUrl: string | null;
}

export interface UserProfile {
  experienceLevel:
    | string
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Professional";
  marketsTraded: string[];
  tradingStyle: string[];
  strategyPreferences: string[];
}
