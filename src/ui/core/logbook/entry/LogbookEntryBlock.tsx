/**
 * Displays a specific logbook entry.
 *
 * @todo Deciding on the best layout for this.
 *   - Vertical timeline with most recent update first?
 */
'use client';

import {
  useLogbookActions,
  useLogbookEntry,
} from '@/ui/core/logbook/LogbookContext';
import LogbookUpdate from '@/ui/core/logbook/entry/LogbookUpdate';
import { Input } from '@/ui/design/input';
import { Textarea } from '@/ui/design/textarea';
import { Button } from '@/ui/design/button';
import { PlusIcon } from 'lucide-react';

type Props = {
  id: string;
};

export default function LogbookEntryBlock(props: Props) {
  const entry = useLogbookEntry(props.id);
  const { createUpdate, setEntry } = useLogbookActions();

  return (
    <div className="mb-8 mt-4">
      <Input
        value={entry.entity.title}
        onChange={(title) => {
          setEntry({
            id: props.id,
            title,
          });
        }}
        variant="title"
      />
      <Textarea
        value={entry.entity.description}
        onChange={(description) => {
          setEntry({
            id: props.id,
            description,
          });
        }}
        placeholder="Description"
      />
      <Button
        variant="outline"
        onClick={() => {
          createUpdate({ entryID: entry.id });
        }}
      >
        <PlusIcon className="mr-1 h-4 w-4" /> New Update
      </Button>
      {entry.references.updates.ids.map((id) => (
        <div key={id} className="mt-8">
          <LogbookUpdate id={id} />
        </div>
      ))}
    </div>
  );
}
