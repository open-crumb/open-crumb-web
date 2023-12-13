'use client';

import { createContext } from 'react';

type ApplicationContextValue = {
  locale: string;
  preferences: {
    units: 'IMPERIAL' | 'METRIC';
    temperature: 'FAHRENHEIT' | 'CELSIUS';
  };
};

const ApplicationContext = createContext<ApplicationContextValue>({
  locale: 'en-US',
  preferences: {
    units: 'METRIC',
    temperature: 'FAHRENHEIT',
  },
});

export default ApplicationContext;

type Props = {
  children: React.ReactNode;
};

export function ApplicationProvider({ children }: Props) {
  return (
    <ApplicationContext.Provider
      value={{
        locale: 'en-US',
        preferences: {
          units: 'METRIC',
          temperature: 'FAHRENHEIT',
        },
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
