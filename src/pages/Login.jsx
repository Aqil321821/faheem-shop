import React from 'react';
import { useForm } from '@mantine/form';
import { Card, TextInput, Stack, Divider, Title, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../firebase';

function Login() {
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Please provide a valid email address'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters long'),
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const qry = query(collection(fireDB, 'users'), where('email', '==', loginForm.values.email), where('password', '==', loginForm.values.password));
      const existingUsers = await getDocs(qry);
      if (existingUsers.size > 0) {
        alert('Login Ho gaya to Kaaliya');
      } else {
        alert('Chala Ja Bhosdi kay ! Galat Password/email daal raha ha Bsdk');
      }
    } catch (error) {
      console.log(error);
      alert('Kuch to galat hoa ha , mujhse Raabta kar lay !');
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const isValid = loginForm.validate(); // Trigger validation
    if (!isValid.hasErrors) {
      console.log(loginForm.values); // Handle form submission
      // Submit form or perform further actions
      onSubmit(e);
    }
  };

  return (
    <>
      <div className='flex h-screen justify-center items-center'>
        <Card sx={{ width: 400 }} shadow='lg' withBorder>
          <Title order={3} align='center' mb={3}>
            Login With Your Credentials
          </Title>

          <Divider my='sm' />
          <form onSubmit={submitForm}>
            <Stack mt={4}>
              {/* Email Input */}
              <TextInput label='Email' placeholder='Enter Your Email' name='email' {...loginForm.getInputProps('email')} error={loginForm.errors.email} onBlur={() => loginForm.validateField('email')} />

              {/* Password Input */}
              <TextInput type='password' label='Password' placeholder='Enter Your Password' name='password' {...loginForm.getInputProps('password')} error={loginForm.errors.password} onBlur={() => loginForm.validateField('password')} />

              {/* Submit Button */}
              <Button
                type='submit'
                mt='md'
                fullWidth
                disabled={!loginForm.isValid()} // Disable if form is invalid
              >
                Login
              </Button>

              {/* Link to Register */}
              <Link to='/register' className='text-center block mt-3'>
                Don't have an account? Register now!
              </Link>
            </Stack>
          </form>
        </Card>
      </div>
    </>
  );
}

export default Login;