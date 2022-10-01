
import _ from 'lodash';
import React, { ComponentPropsWithoutRef } from 'react';

import { Icon } from '../src/components/Icon';

export default {
  title: 'Icon',
  component: Icon,
};

export const Default = (
  props: ComponentPropsWithoutRef<typeof Icon>
) => <Icon {...props} />;