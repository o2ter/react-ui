
import _ from 'lodash';
import React, { ComponentPropsWithoutRef } from 'react';

import { Button } from '../src/components/Button';
import * as colors from '../src/theme/variables/colors';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: _.keys(colors) },
  },
};

export const Solid = (
  props: ComponentPropsWithoutRef<typeof Button>
) => <Button {...props} />;
Solid.args = {
  title: 'Button',
  variant: 'primary',
  outline: false,
};

export const Outline = (
  props: ComponentPropsWithoutRef<typeof Button>
) => <Button {...props} />;
Outline.args = {
  title: 'Button',
  variant: 'primary',
  outline: true,
};