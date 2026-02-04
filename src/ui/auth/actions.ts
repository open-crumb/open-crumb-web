"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const MIN_PASSWORD_LENGTH = 12;

const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(MIN_PASSWORD_LENGTH),
});

type SignInState = (
	| {
			type: "idle";
	  }
	| {
			type: "error";
			emailError?: string;
			passwordError?: string;
			message?: string;
	  }
) & {
	defaultValues: {
		email: string;
	};
};

/**
 * Server action to sign in a user. Provide the `idle` initial state when used
 * with `useActionState`.
 */
export async function signInAction(
	state: SignInState,
	formData: FormData,
): Promise<SignInState> {
	const rawEmail = formData.get("email");
	const defaultValues = {
		email: typeof rawEmail === "string" ? rawEmail : "",
	};
	const validationResult = signInSchema.safeParse({
		email: rawEmail,
		password: formData.get("password"),
	});

	if (!validationResult.success) {
		const errors = z.flattenError(validationResult.error);

		return {
			type: "error",
			...(errors.fieldErrors.email && {
				emailError: "Invalid email address.",
			}),
			...(errors.fieldErrors.password && {
				passwordError: "Invalid password.",
			}),
			defaultValues,
		};
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: validationResult.data.email,
				password: validationResult.data.password,
			},
		});
	} catch (error) {
		if (!(error instanceof APIError)) {
			console.error("signInAction error:", error);

			return {
				type: "error",
				message: "Something went wrong. Please try again later.",
				defaultValues,
			};
		}

		switch (error.body?.code) {
			case "EMAIL_PASSWORD_DISABLED":
				return {
					type: "error",
					message: "Sign in is disabled at the moment. Please try again later.",
					defaultValues,
				};
			case "INVALID_EMAIL_OR_PASSWORD":
				return {
					type: "error",
					message: "Invalid email or password.",
					defaultValues,
				};
			case "EMAIL_NOT_VERIFIED":
				return {
					type: "error",
					message:
						"Email not verified. Please check your email for a verification link.",
					defaultValues,
				};
			default:
				console.error("signInAction error:", error, error.body);

				return {
					type: "error",
					message: "Something went wrong. Please try again later.",
					defaultValues,
				};
		}
	}

	redirect("/dashboard");
}

const signUpSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(MIN_PASSWORD_LENGTH),
});

type SignUpState = (
	| {
			type: "idle";
	  }
	| {
			type: "error";
			nameError?: string;
			emailError?: string;
			passwordError?: string;
			message?: string;
	  }
) & {
	defaultValues: {
		name: string;
		email: string;
	};
};

export async function signUpAction(
	state: SignUpState,
	formData: FormData,
): Promise<SignUpState> {
	const rawName = formData.get("name");
	const rawEmail = formData.get("email");
	const defaultValues = {
		name: typeof rawName === "string" ? rawName : "",
		email: typeof rawEmail === "string" ? rawEmail : "",
	};
	const validationResult = signUpSchema.safeParse({
		name: rawName,
		email: rawEmail,
		password: formData.get("password"),
	});

	if (!validationResult.success) {
		const errors = z.flattenError(validationResult.error);

		return {
			type: "error",
			...(errors.fieldErrors.name && {
				nameError: "Invalid name.",
			}),
			...(errors.fieldErrors.email && {
				emailError: "Invalid email address.",
			}),
			...(errors.fieldErrors.password && {
				passwordError: "Password must be at least 12 characters long.",
			}),
			defaultValues,
		};
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: validationResult.data.name,
				email: validationResult.data.email,
				password: validationResult.data.password,
			},
		});
	} catch (error) {
		if (!(error instanceof APIError)) {
			console.error("signInAction error:", error);

			return {
				type: "error",
				message: "Something went wrong. Please try again later.",
				defaultValues,
			};
		}

		switch (error.body?.code) {
			case "EMAIL_AND_PASSWORD_SIGN_UP_IS_NOT_ENABLED":
				return {
					type: "error",
					message: "Sign up is disabled at the moment. Please try again later.",
					defaultValues,
				};
			case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
				return {
					type: "error",
					message: "That email has already been registered.",
					defaultValues,
				};
			default:
				console.error("signInAction error:", error, error.body);

				return {
					type: "error",
					message: "Something went wrong. Please try again later.",
					defaultValues,
				};
		}
	}

	redirect("/dashboard");
}

export async function signOutAction() {
	try {
		const headersList = await headers();

		await auth.api.signOut({
			headers: headersList,
		});
	} catch (error) {
		if (error instanceof APIError) {
			console.error("signOutAction error:", error, error.body);
		} else {
			console.error("signOutAction error:", error);
		}
	}

	redirect("/");
}
