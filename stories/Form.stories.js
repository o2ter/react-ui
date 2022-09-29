
import _ from 'lodash';
import React from 'react';

import { string, object } from 'sugax';
import { Form } from '../src/components/Form';

export default {
  title: 'Form',
  component: Form,
};

export const TextInput = () => <Form 
schema={{
  email: string().email().required(),
  name: object({
    first: string().required(),
    last: string().required(),
  }),
}}>
  <Form.TextField name='email' />
  <Form.Group name='name'>
    <Form.TextField name='first' />
    <Form.TextField name='last' />
  </Form.Group>
</Form>;
TextInput.args = {
}