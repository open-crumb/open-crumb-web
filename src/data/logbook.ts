type LogbookEntry = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  title: string;
  description: string;
  updateIDs: string[];
};

type LogbookUpdate = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  date: Date;
  title: string;
  description: string;
  entryID: string;
  ingredientIDs: string[];
};

type LogbookIngredient = {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  text: string;
  updateID: string;
};

const data: {
  LogbookEntry: Record<string, LogbookEntry>;
  LogbookUpdate: Record<string, LogbookUpdate>;
  LogbookIngredient: Record<string, LogbookIngredient>;
} = {
  LogbookEntry: {
    'LogbookEntry.1': {
      id: 'LogbookEntry.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      title: 'Classic Sourdough',
      description: '',
      updateIDs: ['LogbookUpdate.1'],
    },
  },
  LogbookUpdate: {
    'LogbookUpdate.1': {
      id: 'LogbookUpdate.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      date: new Date('2023-11-24T11:00:00.000Z'),
      title: 'Prepare Levain',
      description: '',
      entryID: 'LogbookEntry.1',
      ingredientIDs: [
        'LogbookIngredient.1',
        'LogbookIngredient.2',
        'LogbookIngredient.3',
      ],
    },
  },
  LogbookIngredient: {
    'LogbookIngredient.1': {
      id: 'LogbookIngredient.1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      text: '20g Sourdough Starter',
      updateID: 'LogbookUpdate.1',
    },
    'LogbookIngredient.2': {
      id: 'LogbookIngredient.2',
      createdAt: new Date(),
      modifiedAt: new Date(),
      text: '40g Flour',
      updateID: 'LogbookUpdate.1',
    },
    'LogbookIngredient.3': {
      id: 'LogbookIngredient.3',
      createdAt: new Date(),
      modifiedAt: new Date(),
      text: '40g Water',
      updateID: 'LogbookUpdate.1',
    },
  },
};

export default data;
