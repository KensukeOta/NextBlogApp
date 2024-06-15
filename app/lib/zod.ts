import { string, z } from "zod"

export const loginSchema = z.object({
  email: z.string()
    .email("無効なメールアドレスです")
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  password: string()
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
})

export const signupFormSchema = z.object({
  name: z.string()
    .min(2, { message: "2文字以上で入力してください" })
    .max(50, { message: "50文字以内で入力してください" })
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  email: z.string()
    .email("無効なメールアドレスです")
    .max(254, { message: "254文字以内で入力してください" })
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  password: z.string()
    .min(8, "8文字以上で入力してください")
    .max(32, "32文字以内で入力してください")
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  password_confirmation: z.string()
    .refine(value => value.trim() !== "", { message: "入力必須項目です" }),
}).superRefine((data, ctx) => {
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "パスワードが一致しません",
      path: ["password_confirmation"], // エラーメッセージを表示するフィールド
    });
  }
});

export const postFormSchema = z.object({
  title: z.string().max(50, { message: "50文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  body: z.string().max(10000, { message: "10000文字以内で入力してください" }).refine(value => value.trim() !== "", { message: "入力必須項目です" }),
  user_id: z.string().refine(value => value.trim() !== "", { message: "user_idは入力必須項目です" }),
});