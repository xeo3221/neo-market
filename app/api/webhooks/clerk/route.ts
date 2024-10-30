import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { env } from "@/data/env/server";

export async function POST(req: Request) {
  console.log("Webhook received");

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  if (eventType === "user.created") {
    const { id, email_addresses, image_url } = evt.data;
    console.log("Creating user:", { id, email_addresses, image_url });

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error("No email found for user");
      return new Response("No email found for user", { status: 400 });
    }

    try {
      const newUser = await db.insert(users).values({
        clerkUserId: id,
        email: email,
        imageUrl: image_url || null,
      });

      console.log("User created successfully:", newUser);
      return new Response("User created", { status: 200 });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}

export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}
