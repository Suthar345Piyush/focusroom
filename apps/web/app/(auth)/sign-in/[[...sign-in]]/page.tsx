// sign in page from clerk   


import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";


export const metadata : Metadata = {title : "Sign in"};

export default function SignInPage() {
      return <SignIn routing="path" path="/sign-in"/>
}

