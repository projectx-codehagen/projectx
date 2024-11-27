import { z } from "zod";

export const updateBankAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
  name: z.string().min(2, "Account name must be at least 2 characters."),
  accountType: z.enum(["BANK", "CRYPTO", "INVESTMENT"]),
  description: z.string().optional(),
});

export type UpdateBankAccountSchema = z.infer<typeof updateBankAccountSchema>;
