import {
  useLogbookActions,
  useLogbookUpdate,
} from '@/ui/core/logbook/LogbookContext';
import LogbookIngredient from '@/ui/core/logbook/entry/LogbookIngredient';
import { useContext } from 'react';
import ApplicationContext from '@/ui/core/ApplicationContext';
import TextField from '@/ui/design/TextField';
import TextArea from '@/ui/design/TextArea';
import Button from '@/ui/design/Button';
import Badge from '@/ui/design/Badge';
import LogbookMeasurement from './LogbookMeasurement';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

type Props = {
  id: string;
};

export default function LogbookUpdate(props: Props) {
  const { locale } = useContext(ApplicationContext);
  const update = useLogbookUpdate(props.id);
  const { createIngredient, createMeasurement, deleteUpdate, setUpdate } =
    useLogbookActions();

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow">
          <Badge>{dateFormatter.format(update.entity.date)}</Badge>
        </div>
        <div className="flex-shrink">
          <Button
            onClick={() => {
              deleteUpdate({ id: props.id });
            }}
          >
            <Cross1Icon aria-label="Delete Update" />
          </Button>
        </div>
      </div>
      <TextField.Input
        value={update.entity.title}
        onChange={(title) => {
          setUpdate({
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
          setUpdate({
            id: props.id,
            description,
          });
        }}
        placeholder="Description"
      />
      {update.references.ingredients.ids.length > 0 && (
        <div className="mt-4">
          <Badge>Ingredients</Badge>
          <ul>
            {update.references.ingredients.ids.map((id) => (
              <li key={id}>
                <LogbookIngredient id={id} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={classNames({
          'mt-2': update.references.ingredients.ids.length === 0,
        })}
      >
        <Button
          onClick={() => {
            createIngredient({ updateID: update.id });
          }}
        >
          <PlusIcon className="mr-1" />
          Add Ingredient
        </Button>
      </div>
      {update.references.measurements.ids.length > 0 && (
        <div className="mt-4">
          <Badge>Measurements</Badge>
          <ul>
            {update.references.measurements.ids.map((id) => (
              <li key={id}>
                <LogbookMeasurement id={id} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={classNames({
          'mt-2': update.references.measurements.ids.length === 0,
        })}
      >
        <Button
          onClick={() => {
            createMeasurement({ updateID: update.id });
          }}
        >
          <PlusIcon className="mr-1" />
          Add Measurement
        </Button>
      </div>
    </div>
  );
}
