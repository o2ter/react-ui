
import _ from 'lodash';
import React from 'react';

import { string, object } from 'yup';
import { Form } from '../src/components/Form/Form';
import FormGroup from '../src/components/Form/Group';
import FormTextField from '../src/components/Form/TextField';

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
  <FormTextField name='email' />
  <FormGroup name='name'>
    <FormTextField name='first' />
    <FormTextField name='last' />
  </FormGroup>
</Form>;
TextInput.args = {
}