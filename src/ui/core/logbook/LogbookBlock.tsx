/**
 * Displays the user's logbook entries.
 *
 * @todo Deciding on the best layout for this.
 *   - List ordered by most recent?
 *   - Calendar timeslotted with logbook updates?
 */
import Heading from '@/ui/design/Heading';
import Link from 'next/link';

export default function LogbookBlock() {
  return (
    <div>
      <Heading level="2">Logbook</Heading>
      <ul>
        <li>
          <Link href="/logbook/le.1">Classic Sourdough</Link>
        </li>
      </ul>
    </div>
  );
}
