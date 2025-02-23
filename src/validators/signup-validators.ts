import * as v from "valibot";

export const SignupSchema = v.pipe(
    v.object({
        firstName: v.pipe(
            v.string("Your first name must be a string."),
            v.minLength(1, "Your first name must be more than 1 character."),
            v.nonEmpty("Please enter your first name.")
        ),
        lastName: v.pipe(
            v.string("Your last name must be a string."),
            v.minLength(1, "Your last name must be more than 1 character."),
            v.nonEmpty("Please enter your last name.")
        ),
        email: v.pipe(
            v.string("Your email must be a string."),
            v.nonEmpty("Please enter your email."),
            v.email("The email address is badly formatted.")
        ),
        password: v.pipe(
            v.string("Your password must be a string."),
            v.nonEmpty("Please enter your password."),
            v.minLength(8, "Your password must have at least 6 characters."),
            v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
            v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
            v.regex(/\d/, "Your password must contain at least one number."),
            v.regex(/[^a-zA-Z0-9]/, "Your password must contain at least one special character.")
        ),
        confirmPassword: v.pipe(
            v.string("Your password must be a string."),
            v.nonEmpty("Please confirm your password.")
        ),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "The two passwords do not match."
        ),
        ["confirmPassword"]
    )
);

// const userData = {
//     name: `${formData.firstName} ${formData.lastName}`,
//     email: formData.email,
//     password: formData.password,
// };

export type SignupInput = v.InferInput<typeof SignupSchema>;