'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, subDays, startOfToday, isAfter, isSameDay, parseISO } from 'date-fns';

interface Problem {
  id: string;
  name: string;
  url: string;
  lastReviewDate: string;
  nextReviewDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  reviewCount: number;
  solution?: string;
}

interface DailyStats {
  date: string;
  newProblems: Problem[];
  reviewedProblems: Problem[];
}

export default function StatsClient() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all problems from localStorage
    const loadProblems = () => {
      if (typeof window !== 'undefined') {
        const savedProblems = localStorage.getItem('problems');
        if (savedProblems) {
          const parsedProblems: Problem[] = JSON.parse(savedProblems);
          setProblems(parsedProblems);
          
          // Generate stats for the last 30 days
          const stats = generateDailyStats(parsedProblems, 30);
          setDailyStats(stats);
        }
      }
      setIsLoading(false);
    };

    loadProblems();
  }, []);

  // Generate stats for the specified number of days
  const generateDailyStats = (problems: Problem[], days: number): DailyStats[] => {
    const stats: DailyStats[] = [];
    const today = startOfToday();
    
    // For each day, find problems that were added or reviewed on that day
    for (let i = 0; i < days; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find new problems added on this date
      // (For this, we're assuming problems with reviewCount === 0 and lastReviewDate === the date were added on that date)
      const newProblems = problems.filter(p => 
        p.reviewCount === 0 && 
        isSameDay(parseISO(p.lastReviewDate), date)
      );
      
      // Find problems that were reviewed on this date
      // (For this, we're looking for problems that have lastReviewDate === the date and reviewCount > 0)
      const reviewedProblems = problems.filter(p => 
        p.reviewCount > 0 && 
        isSameDay(parseISO(p.lastReviewDate), date)
      );
      
      stats.push({
        date: dateStr,
        newProblems,
        reviewedProblems
      });
    }
    
    return stats;
  };

  // Get total problems for a specific difficulty
  const getTotalByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    return problems.filter(p => p.difficulty === difficulty).length;
  };

  // Get total problems done
  const getTotalProblems = () => {
    return problems.length;
  };

  // Calculate completion rate for the past 30 days
  const getCompletionRate = () => {
    // Days with at least one activity (new problem or review)
    const activeDays = dailyStats.filter(day => 
      day.newProblems.length > 0 || day.reviewedProblems.length > 0
    ).length;
    
    return Math.round((activeDays / 30) * 100);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-1 p-8">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="text-center">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-1 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary-3">LeetCode Progress Tracker</h1>
            <button
              onClick={handleGoBack}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back to Dashboard
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800">Total Problems</h3>
              <p className="text-3xl font-bold text-blue-600">{getTotalProblems()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-green-800">Easy</h3>
              <p className="text-3xl font-bold text-green-600">{getTotalByDifficulty('Easy')}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-yellow-800">Medium</h3>
              <p className="text-3xl font-bold text-yellow-600">{getTotalByDifficulty('Medium')}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-red-800">Hard</h3>
              <p className="text-3xl font-bold text-red-600">{getTotalByDifficulty('Hard')}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-purple-800">30-Day Completion</h3>
              <p className="text-3xl font-bold text-purple-600">{getCompletionRate()}%</p>
            </div>
          </div>

          {/* Daily Progress Table */}
          <h2 className="text-2xl font-semibold mb-4 text-primary-3">30-Day Progress</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left border-b">Date</th>
                  <th className="py-3 px-4 text-left border-b">New Problems</th>
                  <th className="py-3 px-4 text-left border-b">Reviewed Problems</th>
                  <th className="py-3 px-4 text-left border-b">Total Activity</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((day, index) => (
                  <tr key={day.date} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">{day.date}</td>
                    <td className="py-2 px-4 border-b">
                      {day.newProblems.length > 0 ? (
                        <div>
                          <span className="font-semibold">{day.newProblems.length}</span>
                          <ul className="list-disc pl-5 mt-1">
                            {day.newProblems.map(problem => (
                              <li key={problem.id}>
                                <Link 
                                  href={`/problem/${problem.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {problem.name}
                                </Link>
                                <span className={`
                                  ml-2 inline-block px-2 py-0.5 rounded-full text-xs
                                  ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}
                                `}>
                                  {problem.difficulty}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {day.reviewedProblems.length > 0 ? (
                        <div>
                          <span className="font-semibold">{day.reviewedProblems.length}</span>
                          <ul className="list-disc pl-5 mt-1">
                            {day.reviewedProblems.map(problem => (
                              <li key={problem.id}>
                                <Link 
                                  href={`/problem/${problem.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {problem.name}
                                </Link>
                                <span className="ml-2 text-gray-600 text-xs">
                                  (Review #{problem.reviewCount})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b font-semibold">
                      {day.newProblems.length + day.reviewedProblems.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 