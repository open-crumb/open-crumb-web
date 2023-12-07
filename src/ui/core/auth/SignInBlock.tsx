'use client';

import { signInAction, SignInState } from '@/app/sign-in/actions';
import Button from '@/ui/design/Button';
import Heading from '@/ui/design/Heading';
import TextField from '@/ui/design/TextField';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export default function SignInBlock() {
  const [state, action] = useFormState<SignInState>(signInAction as any, {});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <Heading level="2">Sign In</Heading>
      <form action={action} className="mt-2">
        <TextField.Input
          aria-label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(email) => setEmail(email)}
        />
        <TextField.Root>
          <TextField.Input
            aria-label="Password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(password) => setPassword(password)}
          />
          <TextField.Slot>
            <Button
              onClick={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {isPasswordVisible ? (
                <EyeNoneIcon aria-label="Hide Password" />
              ) : (
                <EyeOpenIcon aria-label="Show Password" />
              )}
            </Button>
          </TextField.Slot>
        </TextField.Root>
        <Button type="submit">Sign In</Button>
      </form>
    </>
  );
}
