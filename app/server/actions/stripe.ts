"use server";

import { db } from "@/drizzle/db";
import {
  cards,
  transactions,
  transactionItems,
  userCards,
  users,
} from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, inArray, and } from "drizzle-orm";
import Stripe from "stripe";
import { env as serverEnv } from "@/data/env/server";
import { env as clientEnv } from "@/data/env/client";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

type CartItem = {
  id: string;
  quantity: number;
};

export async function createCheckoutSession(items: CartItem[]) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user exists in our database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, userId));

    if (!user) {
      throw new Error("User not found in database");
    }

    // Fetch card details from database
    const cardIds = items.map((item) => parseInt(item.id));
    const cardDetails = await db
      .select()
      .from(cards)
      .where(inArray(cards.id, cardIds));

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const card = cardDetails.find((c) => c.id === parseInt(item.id));
      if (!card) throw new Error(`Card ${item.id} not found`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: card.name,
            images: [card.image],
          },
          unit_amount: Math.round(Number(card.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Calculate total price
    const totalPrice = cardDetails.reduce((sum, card) => {
      const item = items.find((i) => parseInt(i.id) === card.id);
      return sum + Number(card.price) * (item?.quantity || 0);
    }, 0);

    // Create transaction record - ensure totalPrice is a string for decimal type
    const [transaction] = await db
      .insert(transactions)
      .values({
        clerkUserId: userId,
        totalPrice: totalPrice.toFixed(2),
      })
      .returning();

    // Create transaction items - ensure priceAtPurchase is properly formatted
    await db.insert(transactionItems).values(
      items.map((item) => {
        const card = cardDetails.find((c) => c.id === parseInt(item.id));
        if (!card) throw new Error(`Card ${item.id} not found`);
        return {
          transactionId: transaction.id,
          cardId: parseInt(item.id),
          quantity: item.quantity,
          priceAtPurchase: Number(card.price).toFixed(2),
        };
      })
    );

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || clientEnv.NEXT_PUBLIC_APP_URL;

    // Create Stripe checkout session with corrected URLs
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?transaction_id=${transaction.id}`,
      cancel_url: `${baseUrl}/marketplace?canceled=true`,
      metadata: {
        transactionId: transaction.id,
        userId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    throw error;
  }
}

export async function handleSuccessfulPayment(transactionId: string) {
  try {
    // First verify the transaction exists and get its details
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Get the user's UUID from users table
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, transaction.clerkUserId));

    if (!user) {
      throw new Error("User not found");
    }

    // Get all transaction items
    const items = await db
      .select()
      .from(transactionItems)
      .where(eq(transactionItems.transactionId, transactionId));

    // Process each item
    for (const item of items) {
      const [existingCard] = await db
        .select()
        .from(userCards)
        .where(
          and(eq(userCards.userId, user.id), eq(userCards.cardId, item.cardId))
        );

      if (existingCard) {
        // Update existing card quantity
        await db
          .update(userCards)
          .set({
            quantity: existingCard.quantity + item.quantity,
          })
          .where(eq(userCards.id, existingCard.id));
      } else {
        // Insert new user card
        await db.insert(userCards).values({
          userId: user.id,
          cardId: item.cardId,
          quantity: item.quantity,
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error handling successful payment:", error);
    throw error;
  }
}
