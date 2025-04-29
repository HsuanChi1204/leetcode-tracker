# LeetCode Tracker

A personal LeetCode problem tracker with spaced repetition review, built with Next.js and Tailwind CSS.

## Features

-  **Customizable Color Theme**: Beautiful pastel palette for a pleasant experience.
-  **Add Problems Easily**: Search and add LeetCode problems with tags and difficulty.
-  **Spaced Repetition**: Review schedule follows a spaced repetition curve (1, 3, 7, 14, 30, 60 days).
-  **Review Today**: See which problems you need to review today.
-  **Already Finished**: Track all problems you have finished, with review count.
-  **Tags & Difficulty**: Each problem displays tags and difficulty for easy filtering.
-  **Local Storage**: All your data is saved in your browser (localStorage).

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HsuanChi1204/leetcode-tracker.git
cd leetcode-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

- **Add a problem**: Use the search bar to find and add a LeetCode problem.
- **Review**: Click the "Review" button to update the review date and follow the spaced repetition schedule.
- **Track progress**: The "Already Finished" section shows all problems you have added, with the number of times reviewed.

## Customization

- **Color theme**: Edit `tailwind.config.js` to change the color palette.
- **Problem data**: You can add more problems or tags in `src/data/leetcodeProblems.ts`.

## Deployment

You can deploy this app to Vercel, Netlify, or GitHub Pages.  
For GitHub Pages (static export):

```bash
npm run build
npm run export
```

Then deploy the `out/` directory to GitHub Pages.
