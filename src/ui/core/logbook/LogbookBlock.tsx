/**
 * Displays the user's logbook entries.
 *
 * @todo Deciding on the best layout for this.
 *   - List ordered by most recent?
 *   - Calendar timeslotted with logbook updates?
 */
import Heading from '@/ui/design/Heading';
import Link from 'next/link';

type Props = {
  entries: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
};

export default function LogbookBlock(props: Props) {
  return (
    <div>
      <Heading level="2">Logbook</Heading>
      <ul>
        {props.entries.map((entry) => (
          <li key={entry.id}>
            <Link href={`/logbook/${entry.slug}`}>{entry.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
