import React from 'react';
import { useForm } from '@mantine/form';
import { Card, TextInput, Stack, Divider, Title, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../firebase';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();

  const registerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Please provide a valid email address'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters long'),
    },
  });

  // Manually trigger validation on submit
  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = registerForm.validate(); // This triggers validation for the whole form

    if (!isValid.hasErrors) {
      if (!isValid.hasErrors) {
        try {
          //check if user exist based on email
          dispatch(ShowLoading());
          const qry = query(collection(fireDB, 'users'), where('email', '==', registerForm.values.email));
          const existingUsers = await getDocs(qry);
          if (existingUsers.size > 0) {
            showNotification({
              title: `abay charye ! Pehle se register ha tu , login kar na'`,
              color: 'red',
            });
            return;
          }
          // Firestore: Save data

          const response = await addDoc(collection(fireDB, 'users'), {
            name: registerForm.values.name,
            email: registerForm.values.email,
            password: registerForm.values.password, // In production, hash passwords!
            createdAt: new Date(),
          });
          if (response.id) {
            showNotification({
              title: `Teri id ban gayi ha ab Login krke Enjoy kr bro !`,
              color: 'green',
            });
          } else {
            showNotification({
              title: `Koi issue aa raha hoga mujhse rabta karle`,
              color: 'red',
            });
          }
          dispatch(HideLoading());
        } catch (error) {
          dispatch(HideLoading());
          console.error('Error registering user:', error);
          showNotification({
            title: `Koi Network Issue ho skta ha ya Backend issue aa raha hoga !`,
            color: 'red',
          });
        }
      }
    }
  };

  return (
    <div className='flex h-screen justify-center items-center'>
      <Card sx={{ width: 400 }} shadow='lg' withBorder>
        <Title order={3} align='center' mb={3}>
          Register With Us
        </Title>

        <Divider my='sm' />
        <form onSubmit={submitForm}>
          <Stack mt={4}>
            {/* Name Input */}
            <TextInput label='Name' placeholder='Enter Your Name' name='name' {...registerForm.getInputProps('name')} error={registerForm.errors.name} onBlur={() => registerForm.validateField('name')} />

            {/* Email Input */}
            <TextInput label='Email' placeholder='Enter Your Email' name='email' {...registerForm.getInputProps('email')} error={registerForm.errors.email} onBlur={() => registerForm.validateField('email')} />

            {/* Password Input */}
            <TextInput label='Password' placeholder='Enter Your Password' name='password' type='password' {...registerForm.getInputProps('password')} error={registerForm.errors.password} onBlur={() => registerForm.validateField('password')} />

            {/* Submit Button (Disable if form is not valid) */}
            <Button type='submit' mt='md' fullWidth disabled={!registerForm.isValid()}>
              Register
            </Button>

            {/* Link to Login Page */}
            <Link to='/login' className='text-center block mt-3'>
              Already have an account? Login now!
            </Link>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Register;
