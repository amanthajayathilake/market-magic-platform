import React, { useState } from "react";
import { AnalysisResult } from "../../types/analysisTypes";
import {
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiBarChart2,
  FiTarget,
  FiDollarSign,
  FiCalendar,
  FiBookOpen,
  FiUser,
} from "react-icons/fi";

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <h2 className="text-xl font-semibold ml-2">{title}</h2>
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-700">{children}</div>
      )}
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  // If there's no valid scenario, show the message
  if (analysis.scenarioType === 0) {
    return (
      <div className="bg-red-900 bg-opacity-20 p-6 rounded-lg border border-red-500">
        <h2 className="text-xl font-bold mb-2">Invalid Chart</h2>
        <p>{analysis.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-4">AI Trading Analysis Report</h1>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">Scenario Type:</span>
          <span className="bg-blue-900 bg-opacity-50 text-blue-300 px-2 py-1 rounded">
            {analysis.scenarioType === 1 &&
              "Single instrument, single timeframe"}
            {analysis.scenarioType === 2 &&
              "Single instrument, multiple timeframes"}
            {analysis.scenarioType === 3 && "Multiple different instruments"}
          </span>
        </div>
      </div>

      {analysis.keyInsights && (
        <Section
          title="Key Insights"
          icon={<FiActivity className="text-blue-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400">Trend</h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    analysis.keyInsights.trend.direction === "BULLISH"
                      ? "bg-green-900 bg-opacity-30 text-green-400"
                      : analysis.keyInsights.trend.direction === "BEARISH"
                      ? "bg-red-900 bg-opacity-30 text-red-400"
                      : "bg-gray-600 bg-opacity-30 text-gray-300"
                  }`}
                >
                  {analysis.keyInsights.trend.direction}
                </span>
              </div>
              <div className="flex items-center">
                {analysis.keyInsights.trend.direction === "BULLISH" ? (
                  <FiTrendingUp className="text-green-400 mr-2" />
                ) : analysis.keyInsights.trend.direction === "BEARISH" ? (
                  <FiTrendingDown className="text-red-400 mr-2" />
                ) : (
                  <FiActivity className="text-gray-400 mr-2" />
                )}
                <span>{analysis.keyInsights.trend.confidence}% confidence</span>
              </div>
            </div>

            <div className="bg-gray-900 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400">Volatility</h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    analysis.keyInsights.volatility.level === "Above"
                      ? "bg-yellow-900 bg-opacity-30 text-yellow-400"
                      : analysis.keyInsights.volatility.level === "Below"
                      ? "bg-blue-900 bg-opacity-30 text-blue-400"
                      : "bg-gray-600 bg-opacity-30 text-gray-300"
                  }`}
                >
                  {analysis.keyInsights.volatility.level}
                </span>
              </div>
              <p className="text-sm">
                {analysis.keyInsights.volatility.context}
              </p>
            </div>

            <div className="bg-gray-900 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400">Volume</h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    analysis.keyInsights.volume.level === "Heavy"
                      ? "bg-purple-900 bg-opacity-30 text-purple-400"
                      : analysis.keyInsights.volume.level === "Light"
                      ? "bg-gray-900 bg-opacity-30 text-gray-400"
                      : "bg-gray-600 bg-opacity-30 text-gray-300"
                  }`}
                >
                  {analysis.keyInsights.volume.level}
                </span>
              </div>
              <p className="text-sm">{analysis.keyInsights.volume.details}</p>
            </div>
          </div>

          {analysis.keyInsights.marketSpecificContext && (
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-20 border border-blue-800 rounded">
              <h3 className="text-blue-400 font-medium mb-1">
                Market-Specific Context
              </h3>
              <p>{analysis.keyInsights.marketSpecificContext}</p>
            </div>
          )}
        </Section>
      )}

      {analysis.analysisSummary && (
        <Section
          title="Analysis Summary"
          icon={<FiBarChart2 className="text-green-400" />}
        >
          <div className="bg-gray-900 p-4 rounded">
            <p>{analysis.analysisSummary}</p>
          </div>
        </Section>
      )}

      {analysis.keyPriceLevels && (
        <Section
          title="Key Price Levels"
          icon={<FiDollarSign className="text-yellow-400" />}
        >
          <div className="bg-gray-900 p-4 rounded mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">Current Price</h3>
              <span className="text-xl font-bold">
                ${analysis.keyPriceLevels.currentPrice.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400 mb-2">Resistance Levels</h3>
                <ul className="space-y-2">
                  {analysis.keyPriceLevels.resistanceLevels.map(
                    (level, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-red-400">
                          ${level.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400">
                          {level.description}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Support Levels</h3>
                <ul className="space-y-2">
                  {analysis.keyPriceLevels.supportLevels.map((level, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-green-400">
                        ${level.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400">{level.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-gray-400 mb-2">Entry Zone</h3>
              <div className="p-3 bg-blue-900 bg-opacity-20 border border-blue-800 rounded">
                <div className="flex justify-between items-center">
                  <span
                    className={
                      analysis.keyPriceLevels.entryZone.type === "long"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {analysis.keyPriceLevels.entryZone.type === "long"
                      ? "Long"
                      : "Short"}{" "}
                    Entry Zone
                  </span>
                  <span>
                    ${analysis.keyPriceLevels.entryZone.min.toLocaleString()} -
                    ${analysis.keyPriceLevels.entryZone.max.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-gray-400 mb-2">Invalidation Level</h3>
              <div className="p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded">
                <div className="flex justify-between items-center">
                  <span>
                    $
                    {analysis.keyPriceLevels.invalidationLevel.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {analysis.keyPriceLevels.invalidationLevel.condition}
                  </span>
                </div>
              </div>
            </div>

            {analysis.keyPriceLevels.extendedSRAnalysis && (
              <div className="mt-4 p-3 bg-gray-800 rounded">
                <h3 className="text-gray-400 mb-1">Extended S/R Analysis</h3>
                <p>{analysis.keyPriceLevels.extendedSRAnalysis}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {analysis.tradingInsights && (
        <Section
          title="Trading Insights"
          icon={<FiTarget className="text-purple-400" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Market Phase</h3>
                <p>{analysis.tradingInsights.marketPhase}</p>
              </div>

              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Momentum Status</h3>
                <p>{analysis.tradingInsights.momentumStatus}</p>
              </div>
            </div>

            <div className="bg-gray-900 p-3 rounded">
              <h3 className="text-gray-400 mb-1">Price Action Signals</h3>
              <p>{analysis.tradingInsights.priceActionSignals}</p>
            </div>

            <div className="bg-gray-900 p-3 rounded">
              <h3 className="text-gray-400 mb-1">Volume Confirmation</h3>
              <p>{analysis.tradingInsights.volumeConfirmation}</p>
            </div>

            {analysis.tradingInsights.keyIndicatorSignals && (
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Key Indicator Signals</h3>
                <p>{analysis.tradingInsights.keyIndicatorSignals}</p>
              </div>
            )}

            {analysis.tradingInsights.trendStrengthAssessment && (
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">
                  Trend Strength Assessment
                </h3>
                <p>{analysis.tradingInsights.trendStrengthAssessment}</p>
              </div>
            )}

            <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-800 rounded">
              <h3 className="text-blue-400 font-medium mb-2">Summary</h3>
              <p>{analysis.tradingInsights.summary}</p>
            </div>
          </div>
        </Section>
      )}

      {analysis.patternRecognition && (
        <Section
          title="Pattern Recognition"
          icon={<FiActivity className="text-yellow-400" />}
        >
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded">
              <h3 className="text-lg font-medium mb-2">
                {analysis.patternRecognition.primaryPattern.name}
              </h3>
              <p className="mb-2">
                {analysis.patternRecognition.primaryPattern.description}
              </p>
              {analysis.patternRecognition.primaryPattern.projectedMove && (
                <div className="p-2 bg-blue-900 bg-opacity-20 border border-blue-800 rounded">
                  <span className="text-blue-400">Projected Move: </span>
                  <span>
                    {analysis.patternRecognition.primaryPattern.projectedMove}
                  </span>
                </div>
              )}
            </div>

            {analysis.patternRecognition.additionalPattern && (
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg font-medium mb-2">
                  {analysis.patternRecognition.additionalPattern.name}
                </h3>
                <p>
                  {analysis.patternRecognition.additionalPattern.description}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1 bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Pattern Confidence</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${analysis.patternRecognition.patternConfidence}%`,
                      }}
                    ></div>
                  </div>
                  <span>{analysis.patternRecognition.patternConfidence}%</span>
                </div>
              </div>

              <div className="flex-1 bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Confirmation Status</h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    analysis.patternRecognition.confirmationStatus ===
                    "confirmed"
                      ? "bg-green-900 bg-opacity-30 text-green-400"
                      : "bg-yellow-900 bg-opacity-30 text-yellow-400"
                  }`}
                >
                  {analysis.patternRecognition.confirmationStatus ===
                  "confirmed"
                    ? "Confirmed"
                    : "Needs Confirmation"}
                </span>
              </div>
            </div>

            {analysis.patternRecognition.patternDetails && (
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Pattern Details</h3>
                <p>{analysis.patternRecognition.patternDetails}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {analysis.actionableStrategy && (
        <Section
          title="Actionable Strategy"
          icon={<FiTarget className="text-green-400" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg font-medium mb-2">Primary Entry</h3>
                <p className="mb-2">
                  {
                    analysis.actionableStrategy.entryStrategies.primary
                      .description
                  }
                </p>
                {analysis.actionableStrategy.entryStrategies.primary.level && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span>
                      $
                      {analysis.actionableStrategy.entryStrategies.primary.level.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-400">
                  {analysis.actionableStrategy.entryStrategies.primary.context}
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg font-medium mb-2">Alternative Entry</h3>
                <p className="mb-2">
                  {
                    analysis.actionableStrategy.entryStrategies.alternative
                      .description
                  }
                </p>
                {analysis.actionableStrategy.entryStrategies.alternative
                  .level && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span>
                      $
                      {analysis.actionableStrategy.entryStrategies.alternative.level.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-400">
                  {
                    analysis.actionableStrategy.entryStrategies.alternative
                      .context
                  }
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-3 rounded">
              <h3 className="text-gray-400 mb-1">Entry Triggers</h3>
              <p>{analysis.actionableStrategy.entryTriggers}</p>
            </div>

            {analysis.actionableStrategy.styleAlignedApproach && (
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Style-Aligned Approach</h3>
                <p>{analysis.actionableStrategy.styleAlignedApproach}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400 mb-2">Risk Management</h3>
                <div className="bg-gray-900 p-3 rounded mb-2">
                  <div className="flex justify-between items-center">
                    <span>Stop Loss</span>
                    <div>
                      <span className="text-red-400">
                        $
                        {analysis.actionableStrategy.riskManagement.stopLoss.level.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">
                        (
                        {
                          analysis.actionableStrategy.riskManagement.stopLoss
                            .percentage
                        }
                        %)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Risk-Reward Ratio</span>
                    <div>
                      <span>
                        {
                          analysis.actionableStrategy.riskManagement
                            .riskRewardRatio.ratio
                        }
                      </span>
                      <span className="text-gray-400 ml-2">
                        (
                        {
                          analysis.actionableStrategy.riskManagement
                            .riskRewardRatio.assessment
                        }
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Profit Targets</h3>
                <div className="bg-gray-900 p-3 rounded mb-2">
                  <div className="flex justify-between items-center">
                    <span>Target 1</span>
                    <div>
                      <span className="text-green-400">
                        $
                        {analysis.actionableStrategy.profitTargets.target1.level.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">
                        (+
                        {
                          analysis.actionableStrategy.profitTargets.target1
                            .percentage
                        }
                        %)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Target 2</span>
                    <div>
                      <span className="text-green-400">
                        $
                        {analysis.actionableStrategy.profitTargets.target2.level.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">
                        (+
                        {
                          analysis.actionableStrategy.profitTargets.target2
                            .percentage
                        }
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded">
              <h3 className="text-red-400 font-medium mb-1">
                Invalidation Trigger
              </h3>
              <p>{analysis.actionableStrategy.invalidationTrigger}</p>
            </div>
          </div>
        </Section>
      )}

      {analysis.economicEvents && (
        <Section
          title="Economic Events"
          icon={<FiCalendar className="text-blue-400" />}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-400 mb-2">Upcoming Events</h3>
              {analysis.economicEvents.upcomingEvents.length > 0 ? (
                <div className="bg-gray-900 rounded overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Event</th>
                        <th className="p-2 text-left">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.economicEvents.upcomingEvents.map(
                        (event, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "" : "bg-gray-800 bg-opacity-50"
                            }
                          >
                            <td className="p-2">{event.date}</td>
                            <td className="p-2">{event.name}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  event.impact === "High"
                                    ? "bg-red-900 bg-opacity-30 text-red-400"
                                    : event.impact === "Medium"
                                    ? "bg-yellow-900 bg-opacity-30 text-yellow-400"
                                    : "bg-blue-900 bg-opacity-30 text-blue-400"
                                }`}
                              >
                                {event.impact}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-900 p-3 rounded">
                  <p>No significant upcoming events.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Potential Impact</h3>
                <p>{analysis.economicEvents.potentialImpact}</p>
              </div>

              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Historical Reaction</h3>
                <p>{analysis.economicEvents.historicalReaction}</p>
              </div>
            </div>

            {analysis.economicEvents.eventImpactAnalysis && (
              <div className="bg-gray-900 p-3 rounded">
                <h3 className="text-gray-400 mb-1">Event Impact Analysis</h3>
                <p>{analysis.economicEvents.eventImpactAnalysis}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {analysis.educationalNotes && (
        <Section
          title="Educational Notes"
          icon={<FiBookOpen className="text-purple-400" />}
          defaultOpen={false}
        >
          <div className="bg-gray-900 p-4 rounded">
            <div className="prose prose-invert max-w-none">
              {analysis.educationalNotes}
            </div>
          </div>
        </Section>
      )}

      {analysis.personalizedTakeaways &&
        analysis.personalizedTakeaways.length > 0 && (
          <Section
            title="Personalized Takeaways"
            icon={<FiUser className="text-green-400" />}
          >
            <div className="bg-blue-900 bg-opacity-20 p-4 rounded border border-blue-800">
              <ul className="space-y-2">
                {analysis.personalizedTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}
    </div>
  );
};

export default AnalysisDisplay;
