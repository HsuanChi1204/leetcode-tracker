// This is a server component
import ProblemClient from './ProblemClient';
import { Problem } from './ProblemClient';

export async function generateStaticParams() {
  // 從 localStorage 獲取所有問題的 ID
  if (typeof window !== 'undefined') {
    const problems = JSON.parse(localStorage.getItem('problems') || '[]');
    return problems.map((problem: Problem) => ({
      id: problem.id,
    }));
  }
  return [];
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  return <ProblemClient id={params.id} />;
} 