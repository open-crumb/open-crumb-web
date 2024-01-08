import {
  useLogbookActions,
  useLogbookUpdate,
} from '@/ui/core/logbook/LogbookContext';
import LogbookIngredient from '@/ui/core/logbook/entry/LogbookIngredient';
import { useContext } from 'react';
import ApplicationContext from '@/ui/core/ApplicationContext';
import { Badge } from '@/ui/design/badge';
import LogbookMeasurement from '@/ui/core/logbook/entry/LogbookMeasurement';
import { cn } from '@/lib/shadcn';
import { Input } from '@/ui/design/input';
import { Textarea } from '@/ui/design/textarea';
import { Button } from '@/ui/design/button';
import { PlusIcon, X as DeleteIcon } from 'lucide-react';

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
            variant="ghost"
            onClick={() => {
              deleteUpdate({ id: props.id });
            }}
            size="icon"
          >
            <DeleteIcon aria-label="Delete Update" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Input
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
      <Textarea
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
          <Badge variant="secondary">Ingredients</Badge>
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
        className={cn({
          'mt-2': update.references.ingredients.ids.length === 0,
        })}
      >
        <Button
          variant="outline"
          onClick={() => {
            createIngredient({ updateID: update.id });
          }}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>
      {update.references.measurements.ids.length > 0 && (
        <div className="mt-4">
          <Badge variant="secondary">Measurements</Badge>
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
        className={cn({
          'mt-2': update.references.measurements.ids.length === 0,
        })}
      >
        <Button
          variant="outline"
          onClick={() => {
            createMeasurement({ updateID: update.id });
          }}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Measurement
        </Button>
      </div>
    </div>
  );
}
