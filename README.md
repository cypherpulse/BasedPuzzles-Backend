# Based Puzzles Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=ethereum&logoColor=white)](https://base.org/)

A production-ready backend API for **Based Puzzles**, a Base mini app featuring Sudoku & Crossword games with NFT minting capabilities, wallet-based authentication, and comprehensive game statistics.

## 🌟 Features

- **Wallet-Based Authentication** - Address-only auth using `x-wallet-address` header
- **Dual Game Modes** - Sudoku and Crossword puzzles with difficulty levels
- **Real-Time Leaderboards** - Global rankings with pagination
- **User Statistics** - Comprehensive stats tracking (wins, streaks, best times)
- **Game Sessions** - Save and resume game progress
- **Daily Puzzles** - Rotating daily challenges
- **NFT Integration** - Achievement-based NFT minting (Base blockchain ready)
- **User Profiles** - Customizable usernames and avatars
- **Type-Safe API** - Full TypeScript implementation with strict typing

## 🛠 Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9+
- **Framework**: Express.js 4.22+
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: Custom wallet-based (no JWT/sessions)
- **Validation**: Built-in request validation
- **Development**: ESLint, Prettier, nodemon

## 📋 Prerequisites

- Node.js 20.x or higher
- pnpm package manager
- MongoDB Atlas account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/cypherpulse/BasedPuzzles-Backend.git
cd BasedPuzzles-Backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/based_puzzles?retryWrites=true&w=majority

# Server
PORT=3000
NODE_ENV=development

# Security (for future use)
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Database Connection

Ensure your MongoDB Atlas cluster allows connections from your IP address and the connection string is correct.

### 5. Development

```bash
# Start development server with hot reload
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require the `x-wallet-address` header:
```
x-wallet-address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

---

## 🎯 Endpoints

### Leaderboard

#### GET /leaderboard
Get global leaderboard rankings.

**Query Parameters:**
- `gameMode` (required): `sudoku` | `crossword`
- `limit` (optional): Number of results (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "walletAddress": "0x123...abc",
      "username": "PuzzleMaster",
      "bestTime": 150,
      "score": 1500,
      "gameMode": "sudoku",
      "difficulty": "hard",
      "completedAt": "2025-12-09T10:00:00Z"
    }
  ],
  "total": 100
}
```

---

### User Management

#### GET /user/stats
Get user statistics. **Requires wallet auth.**

**Response:**
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...abc",
    "totalGames": 50,
    "gamesWon": 45,
    "bestSudokuTime": 120,
    "bestCrosswordTime": 180,
    "currentStreak": 7,
    "longestStreak": 12,
    "averageScore": 1350,
    "totalPlayTime": 7200,
    "lastPlayed": "2025-12-09T10:00:00Z",
    "achievements": ["FirstWin", "StreakMaster"]
  }
}
```

#### GET /user/profile
Get user profile with NFT badges. **Requires wallet auth.**

**Response:**
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...abc",
    "username": "BasePlayer",
    "avatar": "ipfs://Qm...",
    "joinedAt": "2025-01-01T00:00:00Z",
    "nftBadges": [
      {
        "id": "sudoku-master",
        "name": "Sudoku Master",
        "image": "ipfs://Qm...",
        "earnedAt": "2025-12-01T00:00:00Z"
      }
    ],
    "totalRewards": 5
  }
}
```

#### PUT /user/profile
Update user profile (username/avatar). **Requires wallet auth.**

**Request:**
```json
{
  "username": "NewNickname",
  "avatarUrl": "ipfs://Qm..."
}
```

---

### Game Management

#### POST /games/submit
Submit game results. **Requires wallet auth.**

**Request:**
```json
{
  "gameMode": "sudoku",
  "difficulty": "medium",
  "timeTaken": 180,
  "score": 1400,
  "completed": true,
  "hintsUsed": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "newRank": 15,
    "newStreak": 8,
    "nftEarned": "StreakMaster"
  }
}
```

#### POST /games/session
Save game session progress. **Requires wallet auth.**

**Request:**
```json
{
  "gameMode": "crossword",
  "puzzleId": "daily-crossword-2025-12-09",
  "currentGrid": [["A", "B"], ["C", "D"]],
  "elapsedTime": 300,
  "hintsUsed": 1
}
```

#### GET /games/session/:sessionId
Load saved game session. **Requires wallet auth.**

---

### Daily Puzzles

#### GET /puzzles/daily
Get daily puzzle.

**Query Parameters:**
- `gameMode` (required): `sudoku` | `crossword`
- `date` (optional): YYYY-MM-DD format (default: today)

**Response (Sudoku):**
```json
{
  "success": true,
  "data": {
    "id": "daily-sudoku-2025-12-09",
    "gameMode": "sudoku",
    "difficulty": "medium",
    "grid": [[5, 3, 0, ...], ...],
    "date": "2025-12-09",
    "expiresAt": "2025-12-10T00:00:00Z"
  }
}
```

---

### NFT Management

#### POST /nfts/mint
Mint achievement NFT. **Requires wallet auth.**

**Request:**
```json
{
  "achievement": "StreakMaster",
  "metadata": {
    "name": "Streak Master Badge",
    "description": "Awarded for maintaining a 10-game streak",
    "image": "ipfs://Qm..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0xFAKE...",
    "tokenId": 123,
    "nftContract": "0xFAKE..."
  }
}
```

---

## 🗄 Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  walletAddress: String (unique, indexed),
  username: String,
  avatarUrl: String,
  joinedAt: Date,
  totalGames: Number,
  gamesWon: Number,
  bestSudokuTime: Number,
  bestCrosswordTime: Number,
  currentStreak: Number,
  longestStreak: Number,
  averageScore: Number,
  totalPlayTime: Number,
  lastPlayed: Date,
  achievements: [String]
}
```

#### Games
```javascript
{
  _id: ObjectId,
  walletAddress: String (indexed),
  gameMode: String (enum),
  difficulty: String (enum),
  timeTaken: Number,
  score: Number (indexed),
  completed: Boolean,
  hintsUsed: Number,
  playedAt: Date,
  dailyId: String
}
```

#### Daily Puzzles
```javascript
{
  _id: ObjectId,
  id: String (unique, indexed),
  gameMode: String,
  difficulty: String,
  grid: Mixed,
  date: Date,
  expiresAt: Date
}
```

#### Sessions
```javascript
{
  _id: ObjectId,
  walletAddress: String (indexed),
  gameMode: String,
  puzzleId: String (indexed),
  gridState: Mixed,
  elapsedTime: Number,
  hintsUsed: Number,
  createdAt: Date,
  expiresAt: Date
}
```

#### NFTs
```javascript
{
  _id: ObjectId,
  walletAddress: String (indexed),
  tokenId: Number,
  contractAddress: String,
  achievementType: String,
  mintedAt: Date,
  metadata: Mixed
}
```

---

## 🔐 Authentication

This API uses **address-only wallet authentication** - no signatures or JWT tokens required in v1.

### How It Works

1. Frontend sends `x-wallet-address: 0x...` header with any wallet-dependent request
2. Server validates the address format (42 chars, starts with 0x, hex)
3. Address is used as user identity for all operations

### Security Considerations

- All wallet addresses are normalized to lowercase
- Basic format validation prevents malformed addresses
- No session management - each request must include the address
- Ready for signature verification in future versions

---

## 🧪 Testing

### Using REST Client (VS Code)

1. Install "REST Client" extension
2. Open `app.http` file
3. Click "Send Request" above any endpoint

### Using cURL

```bash
# Get leaderboard
curl "http://localhost:3000/api/leaderboard?gameMode=sudoku"

# Get user stats (requires wallet)
curl -H "x-wallet-address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e" \
     "http://localhost:3000/api/user/stats"
```

### Using Postman

Import the `app.http` file or manually create requests with the base URL and appropriate headers.

---

## 📦 Scripts

```bash
# Development
pnpm run dev          # Start with nodemon
pnpm run build        # Build for production
pnpm run start        # Start production server

# Code Quality
pnpm run lint         # Run ESLint
pnpm run format       # Run Prettier
```

---

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
PORT=3000
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway/Render/Vercel

1. Connect your GitHub repository
2. Set environment variables
3. Set build command: `pnpm run build`
4. Set start command: `pnpm start`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

For questions or issues:

- Open an issue on GitHub
- Check the API documentation above
- Review the code comments for implementation details

---

## 🎮 Game Logic

### Scoring System
- Base score calculated from time and difficulty
- Bonuses for streaks and achievements
- Leaderboard ranks by score (desc) then time (asc)

### Streak Calculation
- Daily streak resets if no games played yesterday
- Longest streak tracks personal best
- Achievements unlocked at streak milestones

### Daily Puzzles
- Unique ID format: `daily-{gameMode}-{YYYY-MM-DD}`
- Auto-generated stub puzzles when not found
- 24-hour expiration cycle

---

*Built with ❤️ for the Base ecosystem*</content>
<parameter name="filePath">g:\2025\Learning\Blockchain\Base\Demo\BasedPuzzles-Backend\README.md