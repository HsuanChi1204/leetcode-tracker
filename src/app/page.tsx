'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { problems as leetcodeProblems } from '../data/leetcodeProblems';

interface Problem {
  id: string;
  name: string;
  url: string;
  lastReviewDate: string;
  nextReviewDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  reviewCount: number;
}

// 根據複習次數取得下次複習間隔天數
function getNextReviewInterval(reviewCount: number): number {
  switch (reviewCount) {
    case 0: return 1;  // 第一次複習：1天後
    case 1: return 3;  // 第二次複習：3天後
    case 2: return 7;  // 第三次複習：7天後
    case 3: return 14; // 第四次複習：14天後
    case 4: return 30; // 第五次複習：30天後
    default: return 60; // 第六次及之後：60天後
  }
}

function getInitialProblems(): Problem[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('problems');
    if (saved) return JSON.parse(saved);
    // 初始化：將 leetcodeProblems 全部加入，nextReviewDate 設為 2099-12-31
    const finishedDate = '2099-12-31';
    const today = format(new Date(), 'yyyy-MM-dd');
    const initial = leetcodeProblems.map(p => ({
      id: p.id,
      name: p.name,
      url: p.url,
      lastReviewDate: today,
      nextReviewDate: finishedDate,
      difficulty: p.difficulty,
      tags: p.tags,
      reviewCount: 0,
    }));
    localStorage.setItem('problems', JSON.stringify(initial));
    return initial;
  }
  return [];
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>(getInitialProblems);

  const [newProblem, setNewProblem] = useState('');
  const [searchResults, setSearchResults] = useState<typeof leetcodeProblems>([]);

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const results = leetcodeProblems.filter(problem => 
      problem.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const addProblem = (selectedProblem: typeof leetcodeProblems[0]) => {
    const today = new Date();
    const nextReview = addDays(today, 1); // 第一次複習在1天後

    const newProblemData: Problem = {
      id: selectedProblem.id,
      name: selectedProblem.name,
      url: selectedProblem.url,
      lastReviewDate: format(today, 'yyyy-MM-dd'),
      nextReviewDate: format(nextReview, 'yyyy-MM-dd'),
      difficulty: selectedProblem.difficulty,
      tags: selectedProblem.tags,
      reviewCount: 0,
    };

    setProblems(prev => {
      const updated = [...prev, newProblemData];
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
    setNewProblem('');
    setSearchResults([]);
  };

  const reviewProblem = (id: string) => {
    setProblems(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const today = new Date();
          const newReviewCount = p.reviewCount + 1;
          const interval = getNextReviewInterval(newReviewCount);
          const nextReview = addDays(today, interval);
          
          return {
            ...p,
            lastReviewDate: format(today, 'yyyy-MM-dd'),
            nextReviewDate: format(nextReview, 'yyyy-MM-dd'),
            reviewCount: newReviewCount,
          };
        }
        return p;
      });
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
  };

  // 分類題目
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const problemsToReview = problems.filter(p => p.nextReviewDate <= todayStr);
  const finishedProblems = problems.filter(p => p.nextReviewDate > todayStr);

  return (
    <main className="min-h-screen bg-primary-1 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold mb-8 text-primary-3">LeetCode Review Tracker</h1>
        {/* Add New Problem Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">Add New Problem</h2>
          <div className="relative">
            <input
              type="text"
              value={newProblem}
              onChange={(e) => {
                setNewProblem(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search for a problem..."
              className="w-full p-3 border border-primary-2 rounded-lg focus:outline-none focus:border-primary-3"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-primary-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(result => (
                  <div
                    key={result.id}
                    onClick={() => addProblem(result)}
                    className="p-3 hover:bg-primary-1 cursor-pointer border-b border-primary-2"
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">
                      <span className={`
                        inline-block px-2 py-1 rounded-full text-xs mr-2
                        ${result.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          result.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {result.difficulty}
                      </span>
                      {result.tags.map(tag => (
                        <span key={tag} className="inline-block bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs mr-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* What to Review Today Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">What to Review Today</h2>
          {problemsToReview.length === 0 ? (
            <div className="text-gray-500">🎉 No problems to review today!</div>
          ) : (
            <div className="space-y-4">
              {problemsToReview.map(problem => (
                <div key={problem.id} className="border border-primary-2 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <a 
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-primary-3 hover:text-primary-4"
                        >
                          {problem.name}
                        </a>
                        <span className="bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs">
                          Reviewed {problem.reviewCount} times
                        </span>
                      </div>
                      <div className="mt-2 space-x-2">
                        <span className={`
                          inline-block px-2 py-1 rounded-full text-xs
                          ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {problem.difficulty}
                        </span>
                        {problem.tags.map(tag => (
                          <span key={tag} className="inline-block bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Last Review: {problem.lastReviewDate}
                        <span className="mx-2">•</span>
                        Next Review: {problem.nextReviewDate}
                      </div>
                    </div>
                    <button
                      onClick={() => reviewProblem(problem.id)}
                      className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Already Finished Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">
            Already Finished <span className="text-primary-4">({finishedProblems.length})</span>
          </h2>
          {finishedProblems.length === 0 ? (
            <div className="text-gray-500">No finished problems yet.</div>
          ) : (
            <div className="space-y-4">
              {finishedProblems.map(problem => (
                <div key={problem.id} className="border border-primary-2 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <a 
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-primary-3 hover:text-primary-4"
                        >
                          {problem.name}
                        </a>
                        <span className="bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs">
                          Reviewed {problem.reviewCount} times
                        </span>
                      </div>
                      <div className="mt-2 space-x-2">
                        <span className={`
                          inline-block px-2 py-1 rounded-full text-xs
                          ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {problem.difficulty}
                        </span>
                        {problem.tags.map(tag => (
                          <span key={tag} className="inline-block bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Last Review: {problem.lastReviewDate}
                        <span className="mx-2">•</span>
                        Next Review: {problem.nextReviewDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
} 