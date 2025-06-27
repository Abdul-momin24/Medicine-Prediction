import mongoose, { Schema,models,model } from "mongoose";
import bcrypt from "bcryptjs";


export interface Iuser{
    email:string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?:Date
}



const userSchema = new Schema<Iuser>({
    email : {type:String, required:true, unique:true},
    password:{type:String, required:true}

},{
    timestamps:true
})

// this will not work on arrow function as this will not be able to refer to the document


userSchema.pre('save', async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);

    }

    next();
})


// Saying ki pehle ye server pr hai to wo laa do nahi to naya usser Schema bana do

const User = models?.User || model<Iuser>("User", userSchema)


export default User