"use server"

import { db, auth } from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; // 7 days in seconds

export async function signUp(params: SignUpParams ){
    const {uid,name,email} = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success:false,
                message:"User already exists with this email.Please sign in instead."
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })
        return {
            success:true,
            message:"User created successfully"
        }

    } catch (e:any) {
        console.error("Error creating a user",e)

        if(e.code === 'auth/email-already-exists'){
            return{
                success:false,
                message:"This email is already in use."
            }
        }

        return{
            success:false,
            message:"Failed to create an account"
        }
    }
}

export async function signIn(params: SignInParams) {
    const {email,idToken} = params;
    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: "No user found with this email. Please sign up."
            }
        }

        await setSessionCookie(idToken);
        
    } catch (e) {
        console.log(e)

        return{
            success:false,
            message:"failed to log into an account"
        }
    }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies(); // ✅ Fix: move inside the function
  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    cookieStore.set("session", sessionCookie, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "Lax",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return {
      success: false,
      message: "Failed to set session",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) 
        return null; // No session cookie found
    
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get()

            if(!userRecord.exists) {
                return null; // User not found
            }

            return {
                ...userRecord.data(),
                id: userRecord.id,
            } as User;
    } catch(e){
        console.error(e);
        return null; // Invalid session cookie
    }
}

export async function isAuthenticated(){
    const user =await getCurrentUser();

     return !!user; //   '' => !'' => true => !true => false
}