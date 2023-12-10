import data from '@/data/logbook';
import LogbookBlock from '@/ui/core/logbook/LogbookBlock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logbook',
};

type Data = {
  entries: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
};

async function getData(): Promise<Data> {
  return {
    entries: Object.values(data.LogbookEntry).map((entry) => ({
      id: entry.id,
      slug: entry.id,
      title: entry.title,
    })),
  };
}

export default async function LogbookPage() {
  const data = await getData();

  return <LogbookBlock entries={data.entries} />;
}
