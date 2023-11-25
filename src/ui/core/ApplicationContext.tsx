'use client';

import { createContext } from 'react';

type ApplicationContextValue = {
  locale: string;
};

const ApplicationContext = createContext<ApplicationContextValue>({
  locale: 'en-US',
});

export default ApplicationContext;

type Props = {
  children: React.ReactNode;
};

export function ApplicationProvider({ children }: Props) {
  const locale = 'en-US';

  return (
    <ApplicationContext.Provider value={{ locale }}>
      {children}
    </ApplicationContext.Provider>
  );
}
