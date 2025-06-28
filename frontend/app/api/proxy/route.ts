import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function  POST(request:NextRequest) {
    const body = await request.json();
    console.log(request)
    console.log(body);
    const microservices = await axios.post("http://localhost:5000/predict", body);

    return NextResponse.json(microservices.data, {status:microservices.status})

}