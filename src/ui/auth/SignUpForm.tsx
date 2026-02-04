"use client";

import { useId, useActionState } from "react";
import { signUpAction } from "@/ui/auth/actions";
import { Input } from "@/ui/design/input";
import { Button } from "@/ui/design/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/ui/design/field";

export default function SignUpForm() {
	const nameFieldID = useId();
	const emailFieldID = useId();
	const passwordFieldID = useId();
	const [state, formAction, isPending] = useActionState(signUpAction, {
		type: "idle",
		defaultValues: {
			name: "",
			email: "",
		},
	});

	return (
		<form action={formAction}>
			<h1 className="mb-md text-lg font-medium">Sign Up</h1>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={nameFieldID}>Full Name</FieldLabel>
					<Input
						id={nameFieldID}
						name="name"
						defaultValue={state.defaultValues.name}
						required
					/>
					{state.type === "error" && state.nameError && (
						<FieldError>{state.nameError}</FieldError>
					)}
				</Field>
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
						Sign Up
					</Button>
				</Field>
				{state.type === "error" && <FieldError>{state.message}</FieldError>}
			</FieldGroup>
		</form>
	);
}
