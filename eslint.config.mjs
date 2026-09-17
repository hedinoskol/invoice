import jsEslint from '@eslint/js';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import-x';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import { Alphabet } from 'eslint-plugin-perfectionist/alphabet';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const tsProjectOptions = { project: ['./tsconfig.eslint.json'], projectService: false };

function disableInCI(rule) {
  if (process.env.CI !== undefined) {
    return 'off';
  }

  return rule;
}

const alphabet = Alphabet.generateRecommendedAlphabet()
  .sortByNaturalSort()
  .placeCharacterBefore({ characterAfter: '-', characterBefore: '/' })
  .placeCharacterBefore({ characterAfter: '/', characterBefore: '.' })
  .getCharacters();

const globalJSRules = {
  curly: ['error', 'all'],
  'max-lines-per-function': [disableInCI('warn'), 120],
  'no-console': 'error',
  'no-implicit-coercion': 'error',
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', next: '*', prev: 'block-like' },
    { blankLine: 'always', next: 'block-like', prev: '*' },
    { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
    { blankLine: 'always', next: ['const', 'let', 'var'], prev: '*' },
    { blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
    { blankLine: 'any', next: 'case', prev: 'case' },
    { blankLine: 'always', next: 'default', prev: 'case' },
    { blankLine: 'always', next: 'continue', prev: '*' },
    { blankLine: 'always', next: 'return', prev: '*' },
  ],
  'perfectionist/sort-classes': [
    'error',
    {
      customGroups: [
        {
          elementValuePattern: 's?inject(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'public-angular-inject',
          selector: 'property',
        },
        {
          elementValuePattern: 's?inject(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'protected-angular-inject',
          modifiers: ['protected'],
          selector: 'property',
        },
        {
          elementValuePattern: 's?inject(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'private-angular-inject',
          modifiers: ['private'],
          selector: 'property',
        },
        {
          elementValuePattern: 's?input(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-input',
          selector: 'property',
        },
        {
          decoratorNamePattern: '^Input$',
          groupName: 'angular-input-get',
          selector: 'get-method',
        },
        {
          decoratorNamePattern: '^Input$',
          groupName: 'angular-input-set',
          selector: 'set-method',
        },
        {
          elementValuePattern: 's?model(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-model',
          selector: 'property',
        },
        {
          elementValuePattern: 's?output(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-output',
          selector: 'property',
        },
        {
          elementValuePattern: 's?contentChild(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-content-child',
          selector: 'property',
        },
        {
          elementValuePattern: 's?contentChildren(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-content-children',
          selector: 'property',
        },
        {
          elementValuePattern: 's?viewChild(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-view-child',
          selector: 'property',
        },
        {
          elementValuePattern: 's?viewChildren(?:\\.required)?(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-view-children',
          selector: 'property',
        },
        {
          elementValuePattern: 's?signal(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-signal',
          selector: 'property',
        },
        {
          elementValuePattern: 's?toSignal(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-to-signal',
          selector: 'property',
        },
        {
          elementValuePattern: 's?linkedSignal(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-linked-signal',
          selector: 'property',
        },
        {
          elementValuePattern: 's?computed(?:<[\\s\\S]*?>)?\\([\\s\\S]*?\\)',
          groupName: 'angular-computed',
          selector: 'property',
        },
      ],
      groups: [
        'public-angular-inject',
        'protected-angular-inject',
        'private-angular-inject',
        ['angular-content-child', 'angular-content-children', 'angular-view-child', 'angular-view-children'],
        ['angular-input', 'angular-input-get', 'angular-input-set'],
        'angular-model',
        'angular-output',
        ['private-property', 'protected-property', 'public-property'],
        'static-property',
        'angular-signal',
        'angular-to-signal',
        'angular-computed',
        'angular-linked-signal',
        'constructor',
        { group: ['get-method', 'set-method'], newlinesInside: 1 },
        { group: 'static-method', newlinesInside: 1 },
        { group: 'public-static-method', newlinesInside: 1 },
        { group: 'protected-static-method', newlinesInside: 1 },
        { group: 'private-static-method', newlinesInside: 1 },
        { group: 'method', newlinesInside: 1 },
        { group: 'public-method', newlinesInside: 1 },
        { group: 'protected-method', newlinesInside: 1 },
        { group: 'private-method', newlinesInside: 1 },
      ],
      newlinesBetween: 1,
      newlinesInside: 'ignore',
      type: 'unsorted',
    },
  ],
  'perfectionist/sort-exports': [
    'error',
    {
      alphabet,
      customGroups: [],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [],
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      type: 'custom',
    },
  ],
  'perfectionist/sort-imports': [
    'error',
    {
      alphabet,
      environment: 'node',
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [
        ['type-import', 'value-builtin', 'value-external', 'ts-equals-import', 'unknown'],
        ['type-internal', 'value-internal'],
        ['type-parent', 'value-parent'],
        ['type-sibling', 'value-sibling', 'type-index', 'value-index'],
      ],
      ignoreCase: true,
      maxLineLength: undefined,
      newlinesBetween: 1,
      newlinesInside: 0,
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      sortBy: 'path',
      specialCharacters: 'keep',
      type: 'custom',
      useExperimentalDependencyDetection: true,
    },
  ],
  'perfectionist/sort-interfaces': [
    'error',
    {
      alphabet,
      customGroups: [],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [],
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      type: 'custom',
    },
  ],
  'perfectionist/sort-named-exports': [
    'error',
    {
      alphabet,
      customGroups: [],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [],
      ignoreAlias: false,
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      type: 'custom',
    },
  ],
  'perfectionist/sort-named-imports': [
    'error',
    {
      alphabet,
      customGroups: [],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [],
      ignoreAlias: false,
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      type: 'custom',
    },
  ],
  'perfectionist/sort-objects': [
    'error',
    {
      type: 'unsorted', // Don't sort destructured objects
      useConfigurationIf: {
        objectType: 'destructured',
      },
    },
    {
      type: 'unsorted',
      useConfigurationIf: {
        callingFunctionNamePattern: '^(Component|Directive|Inject|NgModule|Pipe)$',
      },
    },
    {
      type: 'natural', // Sort numeric keys naturally (by numeric value)
      useConfigurationIf: {
        hasNumericKeysOnly: true,
      },
    },
    {
      alphabet,
      customGroups: [],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: [],
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByComputedKey: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      styledComponents: false,
      type: 'custom',
    },
  ],
  'perfectionist/sort-union-types': [
    'error',
    {
      alphabet,
      customGroups: [
        { elementNamePattern: '^null$', groupName: 'null-literal' },
        { elementNamePattern: '^undefined$', groupName: 'undefined-literal' },
      ],
      fallbackSort: { order: 'asc', type: 'subgroup-order' },
      groups: ['unknown', 'null-literal', 'undefined-literal'],
      ignoreCase: true,
      newlinesBetween: 'ignore',
      newlinesInside: 'ignore',
      order: 'asc',
      partitionByComment: false,
      partitionByNewLine: false,
      specialCharacters: 'keep',
      type: 'custom',
    },
  ],
};

export default tsEslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.angular/**', '**/.idea/**'],
  },

  {
    plugins: {
      perfectionist: perfectionistPlugin,
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.builtin,
        ...globals.node,
      },
    },
  },
  {
    extends: [
      jsEslint.configs.recommended,
      ...tsEslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,

      ...angular.configs.tsAll,
    ],
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ...tsProjectOptions,
        tsconfigRootDir: import.meta.dirname,
      },

      sourceType: 'module',
    },
    processor: angular.processInlineTemplates,

    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: ['app'],
          style: 'kebab-case',
          type: 'element',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: ['app'],
          style: 'camelCase',
          type: 'attribute',
        },
      ],
      '@angular-eslint/no-developer-preview': 'off',
      '@angular-eslint/no-experimental': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-pipe-impure': disableInCI('warn'),
      '@angular-eslint/prefer-output-emitter-ref': disableInCI('warn'),
      '@angular-eslint/prefer-signals': disableInCI('warn'),
      '@angular-eslint/require-localize-metadata': 'off',
      '@angular-eslint/sort-keys-in-type-decorator': 'error',
      '@angular-eslint/use-injectable-provided-in': disableInCI('warn'),

      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['UPPER_CASE'],
          modifiers: ['exported', 'const'],
          selector: 'variable',
          types: ['array', 'boolean', 'number', 'string'],
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': disableInCI('warn'),
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-magic-numbers': [
        disableInCI('warn'),
        {
          ignore: [-1, 0, 1],
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': disableInCI('warn'),
      '@typescript-eslint/no-unsafe-call': disableInCI('warn'),
      '@typescript-eslint/no-unsafe-enum-comparison': disableInCI('warn'),
      '@typescript-eslint/no-unsafe-member-access': disableInCI('warn'),
      '@typescript-eslint/no-unsafe-return': disableInCI('warn'),
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          enableAutofixRemoval: { imports: true },
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/parameter-properties': disableInCI('warn'),
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',

      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/default': 'off',
      'import-x/export': 'off',
      'import-x/namespace': 'off',
      'import-x/no-cycle': ['error', { maxDepth: 20 }],
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': disableInCI('warn'),
      'import-x/no-unresolved': 'off',
      'no-console': 'error',
      'no-implicit-coercion': 'error',
      'no-unused-vars': 'off',

      ...globalJSRules,
    },

    settings: {
      'import-x/cache': { lifetime: Number.POSITIVE_INFINITY },
      'import-x/resolver-next': [createTypeScriptImportResolver({ project: './tsconfig.eslint.json' })],
    },
  },

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      ...jsEslint.configs.recommended.rules,
      ...globalJSRules,
      'no-console': 'off',
    },
  },

  {
    extends: [...angular.configs.templateRecommended],
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'TEMPLATE_REFERENCE', // e.g. `<input #inputRef>`
            'STRUCTURAL_DIRECTIVE', // e.g. `*ngIf="true"`, `*ngFor="let item of items"`
            'INPUT_BINDING', // e.g. `[id]="3"`, `[attr.colspan]="colspan"`, [style.width.%]="100", [@triggerName]="expression", `bind-id="handleChange()"`
            'ATTRIBUTE_BINDING', // e.g. `<input required>`, `id="3"`
            'OUTPUT_BINDING', // e.g. `(idChange)="handleChange()"`, `on-id="handleChange()"`
            'TWO_WAY_BINDING', // e.g. `[(id)]="id"`, `bindon-id="id"
          ],
        },
      ],
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/no-inline-styles': disableInCI([
        disableInCI('warn'),
        {
          allowBindToStyle: true,
          allowNgStyle: true,
        },
      ]),
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },

  {
    files: ['**/index*.html'],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': 'off',
    },
  },

  eslintConfigPrettier,
  {
    // Requiring braces for every block is compatible with Prettier.
    rules: { curly: ['error', 'all'] },
  },
);
