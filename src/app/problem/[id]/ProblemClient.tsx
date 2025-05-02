'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  notes: string;
  solution: string;
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
}

export default function ProblemClient({ id }: { id: string }) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('# Write your solution here\n\ndef solution():\n    pass\n');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleGoBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="text-center">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-primary-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Problem header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-primary-3">{problem.title}</h1>
            <button
              onClick={handleGoBack}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
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
                <span className="font-semibold">Last Review:</span> {problem.lastReviewed}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Next Review:</span> {problem.nextReview}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Review Count:</span> {problem.reviewCount}
              </p>
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
        </div>

        {/* Solution editor */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">Solution / Notes</h2>
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, languages.python, 'python')}
              padding={16}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: '14px',
                minHeight: '300px',
                backgroundColor: '#f5f5f5',
              }}
              className="w-full"
            />
          </div>
          <button
            onClick={handleSaveSolution}
            className="bg-primary-3 text-white px-4 py-2 rounded-lg hover:bg-primary-4 transition-colors"
          >
            Save Solution
          </button>
        </div>
      </div>
    </div>
  );
} 