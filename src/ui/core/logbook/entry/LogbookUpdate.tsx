import { useLogbookUpdate } from '@/ui/core/logbook/LogbookContext';
import LogbookIngredient from '@/ui/core/logbook/entry/LogbookIngredient';
import Heading from '@/ui/design/Heading';
import { useContext } from 'react';
import ApplicationContext from '@/ui/core/ApplicationContext';

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
    <div className="mt-4">
      <div>{dateFormatter.format(update.entity.date)}</div>
      <Heading level="3">{update.entity.title}</Heading>
      {update.entity.description && <p>{update.entity.description}</p>}
      {update.references.ingredients.ids.length > 0 && (
        <ul>
          {update.references.ingredients.ids.map((id) => (
            <li key={id}>
              <LogbookIngredient id={id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
