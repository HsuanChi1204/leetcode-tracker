// This is a server component
import ProblemClient from './ProblemClient';
import { Problem } from './ProblemClient';

export async function generateStaticParams() {
  // 由於我們無法在構建時訪問 localStorage，
  // 我們需要一個預定義的問題列表
  const problems = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];

  return problems.map((problem) => ({
    id: problem.id,
  }));
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  return <ProblemClient id={params.id} />;
} 