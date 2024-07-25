/** @format */

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { TextInput } from "../_components/elememts/TextInput";
import { Button } from "../_components/elememts/Button";
import { useUser } from "../context/UserContext";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUserId } = useUser();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/learning_user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("ログインに失敗しました");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData); // デバッグログを追加
      const userId = responseData.user_id;
      console.log("Login successful, userId:", userId);

      setUserId(userId);

      router.push("/mypage");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-screen justify-center">
      <form
        className="flex w-1/2 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-[427px]">
          <TextInput
            label="メールアドレス"
            type="email"
            id="email"
            {...register("email", {
              required: "メールアドレスを入力してください",
            })}
            name="email"
            placeholder="example@example.com"
            variant="primary"
            autoComplete="email"
            className={`${!errors.email && "mb-8"}`}
          />
          {errors.email && typeof errors.email.message === "string" && (
            <p className="mb-8 text-sm text-danger">{errors.email.message}</p>
          )}

          <TextInput
            label="名前"
            type="text"
            id="name"
            {...register("name", { required: "名前を入力してください" })}
            name="name"
            placeholder="名前を入力してください"
            variant="primary"
            autoComplete="name"
          />
          {errors.name && typeof errors.name.message === "string" && (
            <p className="text-sm text-danger">{errors.name.message}</p>
          )}

          <Button
            color="primary"
            block
            className="mt-12"
            type="submit"
            disabled={isSubmitting || loading}
          >
            ログイン
          </Button>
        </div>
      </form>
    </div>
  );
}
