import { tokens } from '@web/style/theme.tokens';
import { createRainbowSprinkles, defineProperties } from 'rainbow-sprinkles';

const responsiveProperties = defineProperties({
  // conditions: {
  //   mobile: {},
  //   tablet: { '@media': 'screen and (min-width: 768px)' },
  //   desktop: { '@media': 'screen and (min-width: 1024px)' },
  // },
  // defaultCondition: 'mobile',
  dynamicProperties: {
    // Define pre-determined values, which will be autosuggested
    color: tokens.colors,
    backgroundColor: tokens.colors,
    margin: tokens.space,
    marginTop: tokens.space,
    marginLeft: tokens.space,
    marginRight: tokens.space,
    marginBottom: tokens.space,

    // Will work with any CSS value
    display: true,
    textAlign: true,
    flexDirection: true,
    justifyContent: true,
    alignItems: true,
  },
  staticProperties: {
    // Build out utility classes that don't use CSS variables
    display: ['block', 'flex', 'inline-block', 'inline-flex'],
  },
  shorthands: {
    bg: ['backgroundColor'],
    m: ['margin'],
    mr: ['marginRight'],
    ml: ['marginLeft'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

export const sprinkles = createRainbowSprinkles(responsiveProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
