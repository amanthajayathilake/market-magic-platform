# Trading AI - AI-Powered Chart Analysis & Trading Insights

An intelligent, AI-powered trading analysis platform that helps traders of all experience levels make better trading decisions through chart pattern recognition, personalized recommendations, and market insights.

![Trading AI Dashboard]
<!-- (https://your-image-url-here.jpg) -->

## Features

- **AI Chart Analysis**: Upload your trading charts and get instant professional-grade analysis
- **Pattern Recognition**: Automatically identify key chart patterns, support/resistance levels, and potential entry/exit points
- **Personalized Insights**: Customize your trader profile to receive tailored recommendations based on your experience level and trading style
- **Trading History**: Track your analyses and review past chart insights to improve your trading strategy
- **User Profiles**: Save your trading preferences, markets, and strategies for personalized analysis
- **Responsive Design**: Full functionality on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React, Tailwind CSS, React Icons
- **Backend**: Next.js API Routes, Node.js
- **AI Integration**: Anthropic Claude API for chart analysis
- **Authentication**: NextAuth.js
<!-- - **Database**: MongoDB with Mongoose -->
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- MongoDB connection (local or Atlas)
- Anthropic API key for Claude

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/trading-ai.git
cd trading-ai
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
<!-- MONGODB_URI=your_mongodb_connection_string -->
CLAUDE_API_KEY=your_anthropic_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Create or edit your trader profile
2. Upload a trading chart image
3. Receive AI-powered analysis including chart patterns, trends, and recommendations
4. Review your analysis history to improve your strategy

## License

This project is licensed under the MIT License.

---

Built with [Next.js](https://nextjs.org/) and powered by [Anthropic Claude](https://www.anthropic.com/claude).
