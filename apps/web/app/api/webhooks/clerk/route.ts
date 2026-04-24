// clerk webhook to sync user to our prisma postgres and express backend  

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {Webhook} from "svix";


const  WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;


interface ClerkUserCreatedEvent {
    type : "user.created" | "user.updated" | "user.deleted";
    data : {
       id : string;
       first_name : string | null;
       last_name : string | null;
       username : string | null;
       image_url : string;
       email_addresses : {email_address : string; id : string}[];
    }
}




export async function POST(req : Request) {

    if(!WEBHOOK_SECRET) {
        console.error("Missing CLERK_WEBHOOK_SECRET");
        return NextResponse.json({error : "Server misconfiguration"}, {status : 500});
    }

    // verifying svix signatures 

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if(!svixId || !svixSignature || !svixTimestamp)  {
       return NextResponse.json({error : "Missing svix headers"}, {status : 400});
    }


    const payload = await req.text();

    const wbhk = new Webhook(WEBHOOK_SECRET);


    //creating an event 

    let event : ClerkUserCreatedEvent;

    // verifying the  newly created webhook 

    try {
        event = wbhk.verify(payload, {
           "svix-id" : svixId,
           "svix-timestamp" : svixTimestamp,
           "svix-signature" : svixSignature,
        }) as ClerkUserCreatedEvent;
    }   catch (err) {
        console.error("Webhook verfication failed:", err);

        return NextResponse.json({error : "Invalid signature"}, {status  : 400});
    }


    // next api url 


    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    // sending to express backend for DB  

    switch(event.type) {


        case "user.created" : {
           const {id, first_name, last_name, username, image_url, email_addresses} = event.data;

           const displayName = [first_name, last_name].filter(Boolean).join(" ") || username || "Anonymous";



           await fetch(`${API_URL}/users/sync`, {
              method : "POST",
              headers : {
                 "Content-Type" : "application/json",
                 "x-webhook-secret" : WEBHOOK_SECRET,
              },


              body : JSON.stringify({
                  ClerkId : id,
                  displayName,
                  username : username ?? `user_${id.slice(-6)}`,
                  avatarUrl : image_url,
                  email : email_addresses[0]?.email_address,
              }),
           })

           break;
        }


        case "user.updated" : {

           const {id, first_name, last_name, username, image_url} = event.data;

           const displayName = [first_name, last_name].filter(Boolean).join(" ") || username || "Anonymous";

           await fetch(`${API_URL}/users/sync`, {
              method : "PATCH",
              headers : {
                 "Content-Type" : "application/json",
                 "x-webhook-secret" : WEBHOOK_SECRET,
              },

              body : JSON.stringify({
                 clerkId : id,
                 displayName,
                 username : username ?? undefined,
                 avatarUrl : image_url,
              })
           });
           break;
        }


        case "user.deleted" : {
           await fetch(`${API_URL}/users/${event.data.id}`, {
             method : "DELETE",
             headers : {"x-webhook-secret" : WEBHOOK_SECRET},
           });
           break;
        }
    }


    return NextResponse.json({received : true});   
}




