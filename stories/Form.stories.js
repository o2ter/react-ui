
import _ from 'lodash';
import React from 'react';

import { string } from 'yup';
import { Form } from '../src/components/Form';

export default {
  title: 'Form',
  component: Form,
};

export const TextInput = (props) => <Form 
schema={{
  test: string().email().required()
}}>
  <Form.TextField name='test' {...props} />
</Form>;
