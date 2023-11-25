/**
 * Displays a specific logbook entry.
 *
 * @todo Deciding on the best layout for this.
 *   - Vertical timeline with most recent update first?
 */
'use client';

import {
  setLogbookEntry,
  useLogbookEntry,
} from '@/ui/core/logbook/LogbookContext';
import LogbookUpdate from '@/ui/core/logbook/entry/LogbookUpdate';
import TextField from '@/ui/design/TextField';
import TextArea from '@/ui/design/TextArea';

type Props = {
  id: string;
};

export default function LogbookEntryBlock(props: Props) {
  const entry = useLogbookEntry(props.id);

  return (
    <>
      <TextField.Input
        value={entry.entity.title}
        onChange={(title) => {
          setLogbookEntry({
            id: props.id,
            title,
          });
        }}
        variant="title"
      />
      <TextArea
        value={entry.entity.description}
        onChange={(description) => {
          setLogbookEntry({
            id: props.id,
            description,
          });
        }}
        placeholder="Description"
      />
      {entry.references.updates.ids.map((id) => (
        <LogbookUpdate key={id} id={id} />
      ))}
    </>
  );
}
