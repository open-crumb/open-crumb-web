import LogbookBlock from '@/ui/core/logbook/LogbookBlock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logbook',
};

export default function LogbookPage() {
  return <LogbookBlock />;
}
