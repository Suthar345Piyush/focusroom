// sign up page from clerk  

import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata : Metadata = {title : "Sign up"};


export  default function SignUpPage() {
   <SignUp routing="path" path="/sign-up"/>;
}


