'use client';

import { useState, useEffect } from 'react';
import { format, addDays, parse } from 'date-fns';
import { problems as leetcodeProblems } from '../data/leetcodeProblems';
import Link from 'next/link';

interface Problem {
  id: string;
  name: string;
  url: string;
  lastReviewDate: string;
  nextReviewDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  reviewCount: number;
  isEditing?: boolean; // 新增用於控制卡片內編輯狀態
  solution?: string; // 用於儲存解題思路的程式碼
  reviewSchedule?: string[]; // 完整的複習時間表 (7次複習的日期)
}

interface ManualAddProblem {
  name: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string;  // Keep as string in the form
}

// Get next review interval based on review count
function getNextReviewInterval(reviewCount: number): number {
  switch (reviewCount) {
    case 0: return 1;  // First review: after 1 day
    case 1: return 3;  // Second review: after 3 days
    case 2: return 7;  // Third review: after 7 days
    case 3: return 14; // Fourth review: after 14 days
    case 4: return 30; // Fifth review: after 30 days
    case 5: return 60; // Sixth review: after 60 days
    default: return 120; // Seventh and later reviews: after 120 days
  }
}

// Generate complete review schedule (7 reviews)
function generateReviewSchedule(startDate: Date): string[] {
  const schedule: string[] = [];
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const interval = getNextReviewInterval(i);
    currentDate = addDays(currentDate, interval);
    schedule.push(format(currentDate, 'yyyy-MM-dd'));
  }
  
  return schedule;
}

function getInitialProblems(): Problem[] {
  // Return stored data without adding any problems automatically
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('problems');
    if (saved) return JSON.parse(saved);
  }
  return [];
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState('');
  const [searchResults, setSearchResults] = useState<typeof leetcodeProblems>([]);
  const [showManualAddForm, setShowManualAddForm] = useState(false);
  const [manualAdd, setManualAdd] = useState<ManualAddProblem>({
    name: '',
    url: '',
    difficulty: 'Easy',
    tags: ''
  });

  // Fix hydration error: initialize data after client-side load
  useEffect(() => {
    setProblems(getInitialProblems());
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const queryLower = query.toLowerCase().trim();
    const results = leetcodeProblems.filter(problem => {
      // 搜尋題目名稱
      const nameMatch = problem.name.toLowerCase().includes(queryLower);
      
      // 搜尋題目號碼（支援 "1", "#1", "leetcode 1" 等格式）
      const numberMatch = problem.id === queryLower || 
                         problem.id === queryLower.replace('#', '') ||
                         queryLower.includes(problem.id);
      
      // 搜尋標籤
      const tagMatch = problem.tags.some(tag => 
        tag.toLowerCase().includes(queryLower)
      );
      
      return nameMatch || numberMatch || tagMatch;
    });
    
    // 按相關性排序：完全匹配的題目號碼優先，然後是名稱匹配，最後是標籤匹配
    results.sort((a, b) => {
      const aIdMatch = a.id === queryLower || a.id === queryLower.replace('#', '');
      const bIdMatch = b.id === queryLower || b.id === queryLower.replace('#', '');
      
      if (aIdMatch && !bIdMatch) return -1;
      if (!aIdMatch && bIdMatch) return 1;
      
      const aNameMatch = a.name.toLowerCase().includes(queryLower);
      const bNameMatch = b.name.toLowerCase().includes(queryLower);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return 0;
    });
    
    setSearchResults(results);
  };

  const addProblem = (selectedProblem: typeof leetcodeProblems[0]) => {
    const today = new Date();
    const nextReview = addDays(today, 1); // First review after 1 day
    const reviewSchedule = generateReviewSchedule(today);

    const newProblemData: Problem = {
      id: selectedProblem.id,
      name: selectedProblem.name,
      url: selectedProblem.url,
      lastReviewDate: format(today, 'yyyy-MM-dd'),
      nextReviewDate: format(nextReview, 'yyyy-MM-dd'),
      difficulty: selectedProblem.difficulty,
      tags: selectedProblem.tags,
      reviewCount: 0,
      reviewSchedule: reviewSchedule,
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

  const handleManualAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const today = new Date();
    const reviewSchedule = generateReviewSchedule(today);
    
    const newProblem: Problem = {
      id: Date.now().toString(),
      name: manualAdd.name,
      url: manualAdd.url,
      difficulty: manualAdd.difficulty,
      tags: manualAdd.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      lastReviewDate: format(today, 'yyyy-MM-dd'),
      nextReviewDate: format(addDays(today, 1), 'yyyy-MM-dd'),
      reviewCount: 0,
      reviewSchedule: reviewSchedule,
    };

    setProblems(prev => {
      const updated = [...prev, newProblem];
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
    setNewProblem('');
    setSearchResults([]);
    setShowManualAddForm(false);
    setManualAdd({
      name: '',
      url: '',
      difficulty: 'Easy',
      tags: ''
    });
  };

  const deleteProblem = (id: string) => {
    setProblems(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleEditProblem = (id: string) => {
    setProblems(prev => 
      prev.map(p => ({
        ...p,
        isEditing: p.id === id ? !p.isEditing : p.isEditing
      }))
    );
  };

  const updateProblem = (id: string, updatedData: Partial<Problem>) => {
    setProblems(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedData,
            isEditing: false
          };
        }
        return p;
      });
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
  };

  const updateNextReviewDate = (id: string, newDate: string) => {
    setProblems(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            nextReviewDate: newDate
          };
        }
        return p;
      });
      localStorage.setItem('problems', JSON.stringify(updated));
      return updated;
    });
  };

  // Categorize problems
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const problemsToReview = problems.filter(p => p.nextReviewDate <= todayStr);
  const finishedProblems = problems.filter(p => p.nextReviewDate > todayStr);

  return (
    <main className="min-h-screen bg-primary-1 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary-3">LeetCode Review Tracker</h1>
          <Link 
            href="/stats" 
            className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
          >
            View Progress Stats
          </Link>
        </div>
        
        {/* Add New Problem Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary-3">Add New Problem</h2>
            <button
              onClick={() => setShowManualAddForm(!showManualAddForm)}
              className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
            >
              {showManualAddForm ? 'Cancel' : 'Add Manually'}
            </button>
          </div>
          
          {/* Manual Add Form */}
          {showManualAddForm ? (
            <div className="mb-6 p-4 border border-primary-2 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Add Problem Manually</h3>
              <form onSubmit={handleManualAdd}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name</label>
                    <input
                      type="text"
                      value={manualAdd.name}
                      onChange={(e) => setManualAdd({...manualAdd, name: e.target.value})}
                      required
                      className="w-full p-2 border border-primary-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Problem URL</label>
                    <input
                      type="url"
                      value={manualAdd.url}
                      onChange={(e) => setManualAdd({...manualAdd, url: e.target.value})}
                      required
                      className="w-full p-2 border border-primary-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={manualAdd.difficulty}
                      onChange={(e) => setManualAdd({...manualAdd, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                      className="w-full p-2 border border-primary-2 rounded-lg"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={manualAdd.tags}
                      onChange={(e) => setManualAdd({...manualAdd, tags: e.target.value})}
                      placeholder="Array, String, Dynamic Programming..."
                      className="w-full p-2 border border-primary-2 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
                  >
                    Add Problem
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={newProblem}
                onChange={(e) => {
                  setNewProblem(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search by problem name, number (#1, 242), or tags..."
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
                      <div className="font-medium">#{result.id}. {result.name}</div>
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
          )}
        </section>

        {/* Problems to Review Today Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">Problems to Review <span className="text-primary-4">({problemsToReview.length})</span></h2>
          {problemsToReview.length === 0 ? (
            <div className="text-gray-500">🎉 No problems to review today!</div>
          ) : (
            <div className="space-y-4">
              {problemsToReview.map(problem => (
                <div key={problem.id} className="border border-primary-2 p-4 rounded-lg">
                  {problem.isEditing ? (
                    // Edit mode
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name</label>
                        <input
                          type="text"
                          value={problem.name}
                          onChange={(e) => updateProblem(problem.id, { name: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem URL</label>
                        <input
                          type="url"
                          value={problem.url}
                          onChange={(e) => updateProblem(problem.id, { url: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          value={problem.difficulty}
                          onChange={(e) => updateProblem(problem.id, { difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={problem.tags.join(', ')}
                          onChange={(e) => updateProblem(problem.id, { tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Review Date</label>
                        <input
                          type="date"
                          value={problem.lastReviewDate}
                          onChange={(e) => updateProblem(problem.id, { lastReviewDate: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Review Date</label>
                        <input
                          type="date"
                          value={problem.nextReviewDate}
                          onChange={(e) => updateProblem(problem.id, { nextReviewDate: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => toggleEditProblem(problem.id)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateProblem(problem.id, {})}
                          className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link 
                            href={`/problem/${problem.id}`}
                            className="text-lg font-medium text-primary-3 hover:text-primary-4"
                          >
                            {problem.name}
                          </Link>
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
                        <div className="mt-2 text-sm text-gray-600 flex items-center">
                          <span>Last Review: {problem.lastReviewDate}</span>
                          <span className="mx-2">•</span>
                          <span>Next Review: </span>
                          <input
                            type="date"
                            value={problem.nextReviewDate}
                            onChange={(e) => updateNextReviewDate(problem.id, e.target.value)}
                            className="ml-1 p-1 border border-primary-2 rounded"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/problem/${problem.id}`}
                          className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors inline-block text-center"
                        >
                          Review
                        </Link>
                        <button
                          onClick={() => toggleEditProblem(problem.id)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProblem(problem.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Problems Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">
            Completed Problems <span className="text-primary-4">({finishedProblems.length})</span>
          </h2>
          {finishedProblems.length === 0 ? (
            <div className="text-gray-500">No completed problems yet.</div>
          ) : (
            <div className="space-y-4">
              {finishedProblems.map(problem => (
                <div key={problem.id} className="border border-primary-2 p-4 rounded-lg">
                  {problem.isEditing ? (
                    // Edit mode
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name</label>
                        <input
                          type="text"
                          value={problem.name}
                          onChange={(e) => updateProblem(problem.id, { name: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem URL</label>
                        <input
                          type="url"
                          value={problem.url}
                          onChange={(e) => updateProblem(problem.id, { url: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          value={problem.difficulty}
                          onChange={(e) => updateProblem(problem.id, { difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={problem.tags.join(', ')}
                          onChange={(e) => updateProblem(problem.id, { tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Review Date</label>
                        <input
                          type="date"
                          value={problem.lastReviewDate}
                          onChange={(e) => updateProblem(problem.id, { lastReviewDate: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Review Date</label>
                        <input
                          type="date"
                          value={problem.nextReviewDate}
                          onChange={(e) => updateProblem(problem.id, { nextReviewDate: e.target.value })}
                          className="w-full p-2 border border-primary-2 rounded-lg"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => toggleEditProblem(problem.id)}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateProblem(problem.id, {})}
                          className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link 
                            href={`/problem/${problem.id}`}
                            className="text-lg font-medium text-primary-3 hover:text-primary-4"
                          >
                            {problem.name}
                          </Link>
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
                        <div className="mt-2 text-sm text-gray-600 flex items-center">
                          <span>Last Review: {problem.lastReviewDate}</span>
                          <span className="mx-2">•</span>
                          <span>Next Review: </span>
                          <input
                            type="date"
                            value={problem.nextReviewDate}
                            onChange={(e) => updateNextReviewDate(problem.id, e.target.value)}
                            className="ml-1 p-1 border border-primary-2 rounded"
                          />
                        </div>

                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleEditProblem(problem.id)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProblem(problem.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
} 