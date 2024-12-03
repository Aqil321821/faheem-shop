import React from 'react';
import { useForm } from '@mantine/form';
import { Stack, TextInput, Select, Button, Group } from '@mantine/core';

function TransactionForm() {
  const transactionForm = useForm({
    initialValues: {
      name: '',
      type: '',
      amount: '',
      date: '',
      category: '',
      reference: '',
      description: '',
    },

  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(transactionForm.values);
  };

  return (
    <div>
      <form action='' onSubmit={onSubmit}>
        <Stack>
          <TextInput name='name' label='Name' placeholder='Enter Transaction Name' {...transactionForm.getInputProps('name')} />

          <Group position='apart' grow>
            <Select
              name='type'
              label='Type'
              placeholder='Select transaction type'
              data={[
                { label: 'Income', value: 'income' },
                { label: 'Expense', value: 'expense' },
              ]}
              {...transactionForm.getInputProps("type")}
            />
            <Select
              name='category'
              label='Category'
              placeholder='Select transaction type'
              data={[
                { label: 'Repairing', value: 'repairing' },
                { label: 'Accessories', value: 'accessories' },
                { label: 'Mobile Sale', value: 'mobile-sale' },
                { label: 'Easyload', value: 'easyload' },
                { label: 'Other', value: 'other' },
                { label: 'Rent', value: 'rent' },
                { label: 'Salary', value: 'salary' },
                { label: 'Electricity', value: 'electricty' },
                { label: 'Food', value: 'food' },
                { label: 'Mobile Purchase', value: 'mobile-purchase' },
                { label: 'Market Purchasing', value: 'market-purchasing' },
              ]}
              {...transactionForm.getInputProps("category")}
            />
          </Group>

          <Group position='apart' grow>
            <TextInput name='amount' label='Amount' placeholder='Enter Transaction Money' {...transactionForm.getInputProps('amount')} />
            <TextInput name='date' label='Date' placeholder='Enter Date ' {...transactionForm.getInputProps('date')} />
          </Group>

          <TextInput name='reference' label='Reference' placeholder='Enter Transaction Reference' {...transactionForm.getInputProps('reference')} />
          <TextInput name='description' label='Description' placeholder='Enter Optional Remarks' {...transactionForm.getInputProps('description')} />

          <Button color='violet' type='submit'>
            ADD
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default TransactionForm;
