import {
  createLogbookIngredient,
  deleteLogbookUpdate,
  setLogbookUpdate,
  useLogbookUpdate,
} from '@/ui/core/logbook/LogbookContext';
import LogbookIngredient from '@/ui/core/logbook/entry/LogbookIngredient';
import Heading from '@/ui/design/Heading';
import { useContext } from 'react';
import ApplicationContext from '@/ui/core/ApplicationContext';
import TextField from '@/ui/design/TextField';
import TextArea from '@/ui/design/TextArea';
import Button from '@/ui/design/Button';

type Props = {
  id: string;
};

export default function LogbookUpdate(props: Props) {
  const { locale } = useContext(ApplicationContext);
  const update = useLogbookUpdate(props.id);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div>
      <div>{dateFormatter.format(update.entity.date)}</div>
      <TextField.Input
        value={update.entity.title}
        onChange={(title) => {
          setLogbookUpdate({
            id: props.id,
            title,
          });
        }}
        variant="title"
        placeholder="Title"
      />
      <TextArea
        value={update.entity.description}
        onChange={(description) => {
          setLogbookUpdate({
            id: props.id,
            description,
          });
        }}
        placeholder="Description"
      />
      {update.references.ingredients.ids.length > 0 && (
        <ul>
          {update.references.ingredients.ids.map((id) => (
            <li key={id}>
              <LogbookIngredient id={id} />
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => {
            createLogbookIngredient({ updateID: update.id });
          }}
        >
          Add Ingredient
        </Button>
        <Button
          onClick={() => {
            deleteLogbookUpdate({ id: update.id });
          }}
        >
          Delete Update
        </Button>
      </div>
    </div>
  );
}
