
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
      first: string().notEmpty(),
      last: string().notEmpty(),
    }),
  }}>
  <Form.TextField name='email' />
  <Form.ErrorMessage name='email' />
  <Form.Group name='name'>
    <Form.TextField name='first' />
    <Form.ErrorMessage name='first' />
    <Form.TextField name='last' />
    <Form.ErrorMessage name='last' />
  </Form.Group>
</Form>;
TextInput.args = {
}