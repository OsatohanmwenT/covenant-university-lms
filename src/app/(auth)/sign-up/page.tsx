"use client";

import AuthForm from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validation";
import React from "react";

const Page = () => {
  return (
    <AuthForm
      onSubmit={signUp}
      schema={signUpSchema}
      defaultValues={{
        fullName: "",
        email: "",
        password: "",
        role: "student",
      }}
      type="SIGN_UP"
    />
  );
};

export default Page;
