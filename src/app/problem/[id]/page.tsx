// This is a server component
import ProblemClient from './ProblemClient';

export async function generateStaticParams() {
  // In a real app, you might fetch these IDs from an API
  // For now, we'll return an empty array which will be filled during build time
  // with the actual IDs used in your application
  return [];
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  return <ProblemClient id={params.id} />;
} 