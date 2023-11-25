/**
 * Displays a specific logbook entry.
 *
 * @todo Deciding on the best layout for this.
 *   - Vertical timeline with most recent update first?
 */
'use client';

import Heading from '@/ui/design/Heading';
import { useLogbookEntry } from '@/ui/core/logbook/LogbookContext';
import LogbookUpdate from '@/ui/core/logbook/entry/LogbookUpdate';

type Props = {
  entryID: string;
};

export default function LogbookBlock(props: Props) {
  const entry = useLogbookEntry(props.entryID);

  return (
    <>
      <Heading level="2">{entry.entity.title}</Heading>
      {entry.entity.description && <p>{entry.entity.description}</p>}
      {entry.references.updates.ids.map((id) => (
        <LogbookUpdate key={id} id={id} />
      ))}
    </>
  );
}
