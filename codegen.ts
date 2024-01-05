import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/api/graphql',
  documents: ['!src/ui/graphql/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  generates: {
    'src/ui/graphql/': {
      preset: 'client',
      plugins: ['typescript-graphql-request'],
      config: {
        rawRequest: true,
        avoidOptionals: {
          field: true,
          inputValue: true,
          object: false,
          defaultValue: true,
        },
        skipTypename: true,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
    },
  },
};

export default config;
