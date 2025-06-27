import { NextAuthOptions } from "next-auth";

import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./mongodb";


export const authOptions: NextAuthOptions ={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"email", type:"text"},
                password:{label: "password", type:"password"}
            },

            async authorize(credentials){
                // return null;
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password");

                }

                try{
                    await connectToDb();
                    console.log(credentials)

                    const user = await User.findOne({email: credentials.email});


                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    // ye is Valid boolean value
                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    if(!isValid){
                        throw new Error("Inavlid email OR password")
                    }
                        console.log("data us here sb kch shi hai")
                    // jo return karenge uska session banega 
                    // or ye next auth ka return hota hsi
                    return {
                        id: user?._id.toString(),
                    }

                }catch(error){

                    console.error("Auth error",error)
                    throw error
                }
            }

        })
    ],
    // Callbacks hamesha provider array ,e bahar aate hai
    callbacks:{
        async jwt({token,user}){
            if(user){
                // token mein id store krdi

                token.id = user.id
            }


            return token
        },
        async session({user,session,token}){

            if(session.user){
                // ession mein user hai he usme humne id ka acess or de doiua

                console.log(session.user)

                session.user.id = token.id as string; 
            }


            return session;
        },

        async redirect({url,baseUrl}){
            return baseUrl
        }
    },
    // Yahan pr batana hai kaha se chize aayengi idhr documentation mein nahi diya hua hai





    pages:{
        signIn:"/login",
        error:"/login",

    },

    session:{
        strategy:"jwt",
        maxAge:2*24*60*60
    },

    secret:process.env.NEXTAUTH_SECRET
};





// jb hum khud ke credentials use krte hai to humein khud ka authorisation ka code likhna pdta hai plus ye humein dono chiz deta hai session and jwt token jisse hum overwrite kr skte hai plusss ye humse puchta hai kaha hai aapka login page or error page or secrettt mangega to session ke details mangega
// session ki strategy overwrute krna chahe to kr skte haic