"use client";

import { auth } from "@/services/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "aryankush025@gmail.com",
      password: "test@1234",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 8 ? null : "Password should be at least 8 characters",
    },
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      router.push("/");

      console.log("#### user", user);
    } catch (error) {
      console.log("#### error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
      <form
        className="flex flex-col items-center space-y-4 border-gray-400 border p-6 rounded-md gap-2 min-w-80"
        onSubmit={form.onSubmit(handleLogin)}
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <label className="flex flex-col w-full">
          Email:
          <input
            className="border border-gray-300 rounded-md px-2 py-1 bg-black"
            type="text"
            name="email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
        </label>

        {form.errors.email && (
          <p className="text-red-500">{form.errors.email}</p>
        )}

        <label className="flex flex-col w-full">
          Password:
          <input
            className="border border-gray-300 rounded-md px-2 py-1 bg-black"
            type="password"
            name="password"
            placeholder="test@1234"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
        </label>

        {form.errors.password && (
          <p className="text-red-500">{form.errors.password}</p>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 w-full"
          type="button"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </form>
    </main>
  );
}
