/**
 * Displays a specific logbook entry.
 *
 * @todo Deciding on the best layout for this.
 *   - Vertical timeline with most recent update first?
 */
'use client';

import {
  createLogbookUpdate,
  setLogbookEntry,
  useLogbookEntry,
} from '@/ui/core/logbook/LogbookContext';
import LogbookUpdate from '@/ui/core/logbook/entry/LogbookUpdate';
import TextField from '@/ui/design/TextField';
import TextArea from '@/ui/design/TextArea';
import Button from '@/ui/design/Button';

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
      <Button
        onClick={() => {
          createLogbookUpdate({ entryID: entry.id });
        }}
      >
        New Update
      </Button>
      {entry.references.updates.ids.map((id) => (
        <div key={id} className="mt-8">
          <LogbookUpdate id={id} />
        </div>
      ))}
    </>
  );
}
