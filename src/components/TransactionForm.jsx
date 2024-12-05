import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Stack, TextInput, Select, Button, Group, NumberInput } from '@mantine/core';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { fireDB } from '../firebase';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import moment from 'moment';

function TransactionForm({ formMode, setFormMode, setShowForm, transactionData, onTransactionAdded }) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const today = moment().format('YYYY-MM-DD'); // Local time zone ke hisaab se date

  const transactionForm = useForm({
    initialValues: {
      name: '',
      type: '',
      amount: '',
      date: today,
      category: '',
      reference: '',
      description: '',
    },
    validate: {
      name: (value) => (value.trim() !== '' ? null : 'Name is required'),
      type: (value) => (value.trim() !== '' ? null : 'Type is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      date: (value) => (value.trim() !== '' ? null : 'Date is required'),
      category: (value) => (value.trim() !== '' ? null : 'Category is required'),
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (transactionForm.validate().hasErrors) {
      showNotification({
        title: 'Validation failed',
        message: 'Please fill all required fields correctly',
        color: 'red',
      });
      return;
    }

    try {
      dispatch(ShowLoading());
      // Add or Update Transaction Logic
      const transactionData = {
        ...transactionForm.values,
        time: serverTimestamp(), // Adding timestamp here
      };

      if (formMode === 'add') {
        await addDoc(collection(fireDB, `users/${user.id}/transactions`), transactionData);
        showNotification({
          title: 'Transaction added successfully',
          color: 'green',
        });
      } else if (formMode === 'edit') {
        await setDoc(doc(fireDB, `users/${user.id}/transactions`, transactionData.id), transactionData);
        showNotification({
          title: 'Transaction updated successfully',
          color: 'green',
        });
      }
      // Reset form after submission and trigger UI re-render
      transactionForm.reset();
      dispatch(HideLoading());
      setShowForm(false);
      onTransactionAdded(); // Triggered after successful update to re-fetch data
    } catch (error) {
      showNotification({
        title: `Error in ${formMode === 'add' ? 'adding' : 'updating'} transaction`,
        message: error.message || 'An error occurred, please try again later.',
        color: 'red',
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    if (formMode === 'edit' && transactionData) {
      const formattedDate = moment(transactionData.date, ['DD-MM-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD');
      transactionForm.setValues({
        ...transactionData,
        date: formattedDate,
      });
    }
  }, [transactionData, formMode]);

  // console.log(transactionData.id);

  return (
    <div>
      <form onSubmit={onSubmit}>
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
              {...transactionForm.getInputProps('type')}
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
              {...transactionForm.getInputProps('category')}
            />
          </Group>
          <Group position='apart' grow>
            <NumberInput label='Amount' placeholder='Enter transaction amount' {...transactionForm.getInputProps('amount')} />
            <TextInput name='date' type='date' label='Date' min={today} placeholder='Enter Date' {...transactionForm.getInputProps('date')} />
          </Group>
          <TextInput name='reference' label='Reference' placeholder='Enter Transaction Reference' {...transactionForm.getInputProps('reference')} />
          <TextInput name='description' label='Description' placeholder='Enter Optional Remarks' {...transactionForm.getInputProps('description')} />
          <Button type='submit' color={formMode === 'add' ? 'green' : 'blue'}>
            {formMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default TransactionForm;
