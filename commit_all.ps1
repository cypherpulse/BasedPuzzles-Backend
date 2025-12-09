# PowerShell script to commit all untracked files individually with commit messages and push
# This script commits all 28 untracked files for the Based Puzzles backend project on Base Blockchain

# Get all untracked files
$files = git ls-files --others --exclude-standard

# Base message template
$baseMessage = "Added {0} for Based Puzzles Backend - Base-native backend API with game logic, leaderboard management, NFT integration, user authentication, and blockchain connectivity on Base blockchain"

foreach ($file in $files) {
    Write-Host "Committing $file..."
    git add $file
    $message = $baseMessage -f $file
    git commit -m $message
    git push origin master
    Write-Host "Committed and pushed $file"
}

Write-Host "All 28 untracked files committed individually and pushed. Ready to showcase contributions to Based Puzzles Backend on Base blockchain with API endpoints, game services, and onchain features."