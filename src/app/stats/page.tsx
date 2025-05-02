// This is a server component
import StatsClient from './StatsClient';

export async function generateStaticParams() {
  return []; // Empty array since this is a single page
}

export default function StatsPage() {
  return <StatsClient />;
} 