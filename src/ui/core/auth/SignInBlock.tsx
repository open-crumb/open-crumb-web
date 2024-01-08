'use client';

import { signInAction, SignInState } from '@/app/sign-in/actions';
import { Button } from '@/ui/design/button';
import Heading from '@/ui/design/Heading';
import { Input, InputContainer, InputSlot } from '@/ui/design/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
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
        <Input
          aria-label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(email) => setEmail(email)}
        />
        <InputContainer>
          <Input
            aria-label="Password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(password) => setPassword(password)}
          />
          <InputSlot>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              size="icon"
            >
              {isPasswordVisible ? (
                <EyeOffIcon aria-label="Hide Password" className="h-4 w-4" />
              ) : (
                <EyeIcon aria-label="Show Password" className="h-4 w-4" />
              )}
            </Button>
          </InputSlot>
        </InputContainer>
        <Button variant="outline" className="mt-2">
          Sign In
        </Button>
      </form>
    </>
  );
}
