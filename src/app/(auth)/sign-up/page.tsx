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
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        universityId: "",
        userType: "student",
      }}
      type="SIGN_UP"
    />
  );
};

export default Page;
