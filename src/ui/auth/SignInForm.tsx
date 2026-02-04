"use client";

import { useId, useActionState } from "react";
import { signInAction } from "@/ui/auth/actions";
import { Input } from "@/ui/design/input";
import { Button } from "@/ui/design/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/ui/design/field";

export default function SignInForm() {
	const emailFieldID = useId();
	const passwordFieldID = useId();
	const [state, formAction, isPending] = useActionState(signInAction, {
		type: "idle",
		defaultValues: {
			email: "",
		},
	});

	return (
		<form action={formAction}>
			<h1 className="mb-md text-lg font-medium">Sign In</h1>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={emailFieldID}>Email</FieldLabel>
					<Input
						id={emailFieldID}
						name="email"
						type="email"
						defaultValue={state.defaultValues.email}
						required
					/>
					{state.type === "error" && state.emailError && (
						<FieldError>{state.emailError}</FieldError>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor={passwordFieldID}>Password</FieldLabel>
					<Input
						id={passwordFieldID}
						name="password"
						type="password"
						minLength={12}
						required
					/>
					{state.type === "error" && state.passwordError && (
						<FieldError>{state.passwordError}</FieldError>
					)}
				</Field>
				<Field orientation="horizontal">
					<Button type="submit" aria-disabled={isPending}>
						Sign In
					</Button>
				</Field>
				{state.type === "error" && <FieldError>{state.message}</FieldError>}
			</FieldGroup>
		</form>
	);
}
