// This is a server component
import ProblemClient from './ProblemClient';
import { Problem } from './ProblemClient';

export async function generateStaticParams() {
  // 導入 LeetCode 題目數據
  const { problems } = await import('../../../data/leetcodeProblems');
  
  // 獲取所有 LeetCode 題目的 ID
  const leetcodeIds = problems.map(problem => problem.id);
  
  // 添加一些常見的數字 ID 範圍以支持手動添加的題目
  const commonIds = Array.from({ length: 3000 }, (_, i) => (i + 1).toString());
  
  // 合併所有 ID 並去重
  const combinedIds = [...leetcodeIds, ...commonIds];
  const allIds = Array.from(new Set(combinedIds));
  
  return allIds.map((id) => ({
    id: id,
  }));
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  return <ProblemClient id={params.id} />;
} 