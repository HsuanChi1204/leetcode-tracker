'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import { format, addDays } from 'date-fns';

export interface Problem {
  id: string;
  name: string;
  url: string;
  lastReviewDate: string;
  nextReviewDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  reviewCount: number;
  isEditing?: boolean;
  solution?: string;
  reviewSchedule?: string[]; // 完整的複習時間表 (7次複習的日期)
}

// Get next review interval based on review count
function getNextReviewInterval(reviewCount: number): number {
  switch (reviewCount) {
    case 0: return 1;  // First review: after 1 day
    case 1: return 3;  // Second review: after 3 days
    case 2: return 7;  // Third review: after 7 days
    case 3: return 14; // Fourth review: after 14 days
    case 4: return 30; // Fifth review: after 30 days
    default: return 60; // Sixth and later reviews: after 60 days
  }
}

export default function ProblemClient({ id }: { id: string }) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('# Write your solution here\n\ndef solution():\n    pass\n\n# Test your solution\nprint("Hello, World!")');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedReview, setHasCompletedReview] = useState(false);

  useEffect(() => {
    // Load problem from localStorage
    const loadProblem = () => {
      if (typeof window !== 'undefined') {
        const savedProblems = localStorage.getItem('problems');
        if (savedProblems) {
          const problems: Problem[] = JSON.parse(savedProblems);
          const foundProblem = problems.find(p => p.id === id);
          
          if (foundProblem) {
            setProblem(foundProblem);
            // If the problem has a saved solution, use it
            if (foundProblem.solution) {
              setCode(foundProblem.solution);
            }
          }
        }
      }
      setIsLoading(false);
    };

    loadProblem();
  }, [id]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      // 使用 Pyodide 在瀏覽器中執行 Python 代碼
      // 首先檢查是否已經載入 Pyodide
      if (!(window as any).pyodide) {
        setOutput('Loading Python environment...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        (window as any).pyodide = await (window as any).loadPyodide();
      }
      
      const pyodide = (window as any).pyodide;
      
      // 捕獲 print 輸出
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);
      
      // 執行用戶代碼
      pyodide.runPython(code);
      
      // 獲取輸出
      const result = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(result || 'Code executed successfully (no output)');
      
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSolution = () => {
    if (!problem) return;

    // Update problem with new solution
    if (typeof window !== 'undefined') {
      const savedProblems = localStorage.getItem('problems');
      if (savedProblems) {
        const problems: Problem[] = JSON.parse(savedProblems);
        const updatedProblems = problems.map(p => {
          if (p.id === problem.id) {
            return {
              ...p,
              solution: code
            };
          }
          return p;
        });
        
        localStorage.setItem('problems', JSON.stringify(updatedProblems));
        alert('Solution saved successfully!');
      }
    }
  };

  const handleCompleteReview = () => {
    if (!problem) return;

    // Update problem review status
    if (typeof window !== 'undefined') {
      const savedProblems = localStorage.getItem('problems');
      if (savedProblems) {
        const problems: Problem[] = JSON.parse(savedProblems);
        const updatedProblems = problems.map(p => {
          if (p.id === problem.id) {
            const today = new Date();
            const newReviewCount = p.reviewCount + 1;
            const interval = getNextReviewInterval(newReviewCount);
            const nextReview = addDays(today, interval);
            
            return {
              ...p,
              lastReviewDate: format(today, 'yyyy-MM-dd'),
              nextReviewDate: format(nextReview, 'yyyy-MM-dd'),
              reviewCount: newReviewCount,
              solution: code // Save current solution
            };
          }
          return p;
        });
        
        localStorage.setItem('problems', JSON.stringify(updatedProblems));
        setHasCompletedReview(true);
        alert('Review completed! Redirecting to home page...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-1 p-8">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="text-center">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-primary-1 p-8">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Problem Not Found</h1>
          <p className="mb-4">The problem you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={handleGoBack}
            className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-1 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Problem header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-primary-3">{problem.name}</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleGoBack}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              {!hasCompletedReview && (
                <button
                  onClick={handleCompleteReview}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Complete Review
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">
                <span className="font-semibold">Difficulty:</span>{' '}
                <span className={`
                  inline-block px-2 py-1 rounded-full text-xs
                  ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}
                `}>
                  {problem.difficulty}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Last Review:</span> {problem.lastReviewDate}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Next Review:</span> {problem.nextReviewDate}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Review Count:</span> {problem.reviewCount}
              </p>
              {problem.url && (
                <p className="mb-2">
                  <span className="font-semibold">Problem URL:</span>{' '}
                  <a 
                    href={problem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    View Problem
                  </a>
                </p>
              )}
            </div>

            <div>
              <p className="font-semibold mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-block bg-primary-5 text-primary-3 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Review Schedule Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-primary-3 mb-4">Review Schedule</h3>
            {problem.reviewSchedule && problem.reviewSchedule.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {problem.reviewSchedule.slice(0, 7).map((date, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Review {index + 1}</span>
                      <span className="text-xs text-gray-500">
                        {index === 0 && '+1d'}
                        {index === 1 && '+3d'}
                        {index === 2 && '+7d'}
                        {index === 3 && '+14d'}
                        {index === 4 && '+30d'}
                        {index === 5 && '+60d'}
                        {index === 6 && '+120d'}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        if (typeof window !== 'undefined') {
                          const savedProblems = localStorage.getItem('problems');
                          if (savedProblems) {
                            const problems: Problem[] = JSON.parse(savedProblems);
                            const updatedProblems = problems.map(p => {
                              if (p.id === problem.id) {
                                const newSchedule = [...(p.reviewSchedule || [])];
                                newSchedule[index] = e.target.value;
                                return { ...p, reviewSchedule: newSchedule };
                              }
                              return p;
                            });
                            localStorage.setItem('problems', JSON.stringify(updatedProblems));
                            // Update local state
                            setProblem(prev => prev ? {
                              ...prev,
                              reviewSchedule: prev.reviewSchedule ? 
                                prev.reviewSchedule.map((d, i) => i === index ? e.target.value : d) : 
                                []
                            } : null);
                          }
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">No review schedule found</p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const today = new Date();
                      const newSchedule: string[] = [];
                      let currentDate = new Date(today);
                      
                      for (let i = 0; i < 7; i++) {
                        const interval = getNextReviewInterval(i);
                        currentDate = addDays(currentDate, interval);
                        newSchedule.push(format(currentDate, 'yyyy-MM-dd'));
                      }
                      
                      const savedProblems = localStorage.getItem('problems');
                      if (savedProblems) {
                        const problems: Problem[] = JSON.parse(savedProblems);
                        const updatedProblems = problems.map(p => {
                          if (p.id === problem.id) {
                            return { ...p, reviewSchedule: newSchedule };
                          }
                          return p;
                        });
                        localStorage.setItem('problems', JSON.stringify(updatedProblems));
                        setProblem(prev => prev ? { ...prev, reviewSchedule: newSchedule } : null);
                      }
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Generate Review Schedule
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Code editor and output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solution editor */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primary-3">Solution Editor</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleSaveSolution}
                  className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
                >
                  Save Solution
                </button>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.python, 'python')}
                padding={16}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: '14px',
                  minHeight: '400px',
                  backgroundColor: '#f8f9fa',
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Output panel */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-3">Output</h2>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[400px]">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {output || 'Click "Run Code" to see output here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 