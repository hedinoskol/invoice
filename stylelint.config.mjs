import { propertyGroups } from 'stylelint-config-clean-order';

const propertiesOrder = propertyGroups.map((properties) => ({
  emptyLineBefore: 'never', // Don't add empty lines between order groups.
  properties,
}));

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/.angular/**'],
  overrides: [
    {
      extends: ['stylelint-config-standard-scss'],
      files: ['**/*.scss'],
    },
  ],
  rules: {
    'alpha-value-notation': 'number',
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['inset'],
      },
    ],
    'max-nesting-depth': [
      4,
      {
        ignore: ['blockless-at-rules', 'pseudo-classes'],
      },
    ],
    'media-feature-range-notation': 'prefix',
    'no-descending-specificity': null,
    'order/properties-order': [
      propertiesOrder,
      {
        severity: 'error',
        unspecified: 'bottomAlphabetical',
      },
    ],
    'selector-class-pattern': [
      '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
      {
        message: 'Expected class selector to be in BEM code-style',
      },
    ],
    'selector-pseudo-element-no-unknown': null,
  },
};
