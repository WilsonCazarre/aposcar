import { z } from "zod";

export const onboardUserInputSchema = z.object({
  username: z
    .string()
    .regex(new RegExp(/^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/), "No spaces or special characters")
    .min(5, "Minimum 5 characters"),
});
export type OnboardUserInput = z.infer<typeof onboardUserInputSchema>;
