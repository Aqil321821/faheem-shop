import React from 'react';
import { useForm } from '@mantine/form';
import { Card, TextInput, Stack, Divider, Title, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

function Register() {
  const registerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Name is required'),
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Please provide a valid email address',
      password: (value) =>
        value.length >= 6 ? null : 'Password must be at least 6 characters long',
    },
  });

  // Manually trigger validation on submit
  const submitForm = (e) => {
    e.preventDefault();
    const isValid = registerForm.validate(); // This triggers validation for the whole form

    if (!isValid.hasErrors) {
      console.log(registerForm.values);
      // Submit the form or perform further actions
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <Card sx={{ width: 400 }} shadow="lg" withBorder>
        <Title order={3} align="center" mb={3}>
          Register With Us
        </Title>

        <Divider my="sm" />
        <form onSubmit={submitForm}>
          <Stack mt={4}>
            {/* Name Input */}
            <TextInput
              label="Name"
              placeholder="Enter Your Name"
              name="name"
              {...registerForm.getInputProps('name')}
              error={registerForm.errors.name}
              onBlur={() => registerForm.validateField('name')}
            />

            {/* Email Input */}
            <TextInput
              label="Email"
              placeholder="Enter Your Email"
              name="email"
              {...registerForm.getInputProps('email')}
              error={registerForm.errors.email}
              onBlur={() => registerForm.validateField('email')}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              placeholder="Enter Your Password"
              name="password"
              type="password"
              {...registerForm.getInputProps('password')}
              error={registerForm.errors.password}
              onBlur={() => registerForm.validateField('password')}
            />

            {/* Submit Button (Disable if form is not valid) */}
            <Button
              type="submit"
              mt="md"
              fullWidth
              disabled={!registerForm.isValid()}
            >
              Register
            </Button>

            {/* Link to Login Page */}
            <Link
              to="/login"
              className="text-center block mt-3"
            >
              Already have an account? Login now!
            </Link>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Register;
