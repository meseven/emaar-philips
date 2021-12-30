import React from 'react';
import { TextInput, PasswordInput, Button } from '@mantine/core';

function Login() {
  return (
    <div>
      <TextInput placeholder="username" />
      <PasswordInput placeholder="password" mt={5} required />
      <Button variant="light" mt={5} fullWidth>
        Login
      </Button>
    </div>
  );
}

export default Login;
