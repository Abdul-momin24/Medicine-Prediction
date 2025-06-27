import NextAuth from "next-auth";

import Google from "next-auth/providers/google";


export const {handlers, signIn, signOut, auth} =NextAuth({
    providers:[Google],
    callbacks:{
        async signIn({user,profile}){
            const googleId = profile?.id?.toString()

        }



        async session(params) {
            return{
                ...this.session,
                user:{
                    ...this.session.user,
                    _id: getToken.id
                }
            }
        },
    }
})