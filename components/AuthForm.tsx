"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control } from "react-hook-form";
import Image from "next/image";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      if (type === "sign-up") {
        const {name,email,password} = values;

        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        toast.success('Account create successfully.Please sign in now.');
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();
        if(!idToken) {
          toast.error("Failed to sign in. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        })

        toast.success('You have signed in successfully.');
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was ana error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepEdge</h2>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input className="input" placeholder="Your Name" {...field} />
                    
                  </div>
                  
                  
                )} />
                 )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Email
                      </label>
                      <Input className="input" placeholder="Your email address" {...field} />
                    </div>
                  )} />

                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Password
                      </label>
                      <Input className="input" placeholder="Enter your password" type="password" {...field} />
                    </div>
                  )} />
                  
           
            
            
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in " : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
