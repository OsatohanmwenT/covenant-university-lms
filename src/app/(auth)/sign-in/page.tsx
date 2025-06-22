"use client";

import { signIn } from "next-auth/react";
import AuthForm from "@/components/auth/AuthForm";
import { signInSchema } from "@/lib/validation";
import React from "react";

const Page = () => {
   const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">
  ) => {
    const { email, password } = params;
  
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
  
      console.log("Sign in result:", result);
  
      if (result?.error) {
        return { success: false, error: result.error };
      }
  
      return { success: true };
    } catch (error) {
      console.error(error, "Sign in error");
      return { success: false, error: "Sign in error" };
    }
  };

  return (
    <AuthForm
      onSubmit={signInWithCredentials}
      schema={signInSchema}
      defaultValues={{ email: "", password: "" }}
      type="SIGN_IN"
    />
  );
};

export default Page;
