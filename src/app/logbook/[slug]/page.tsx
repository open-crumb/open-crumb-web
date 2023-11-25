import LogbookEntryBlock from '@/ui/core/logbook/entry/LogbookEntryBlock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classic Sourdough',
};

export default function LogbookEntryPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  return <LogbookEntryBlock id={params.slug} />;
}
