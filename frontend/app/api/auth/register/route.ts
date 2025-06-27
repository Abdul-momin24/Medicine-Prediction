


// import model here 

import User from "@/app/models/User";
import { connectToDb } from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";




export async function POST(request : NextRequest) {

    try{
        // Next js data take time while coming
        const {email, password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error : "Email and password are required"},
                {status:400}
            )
        }

        await connectToDb();


        const existingUser =await User.findOne({email});


        if(existingUser){
            return NextResponse.json(
                {error : "User Already registered"},
                {status:400}
            )
        }



        await User.create({
            email,
            password
        })


        return NextResponse.json(
            {message : "User Created"},
            {status:200}
        )
    }catch(error){
        console.error("registration error",error)
        return NextResponse.json(
            {error:"Failed to reegsiter user"},
            {status:400}
        )
    }





    
}