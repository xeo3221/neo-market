// Importy i konfiguracja dla Drizzle ORM
import {
  pgTable,
  serial,
  text,
  integer,
  uuid,
  timestamp,
  pgEnum,
  decimal,
  index,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdateFn(() => new Date());
// 1. Tabela Użytkowników
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(), // Identyfikator użytkownika z Clerk
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"), // Opcjonalny URL do zdjęcia profilowego
  createdAt,
  updatedAt,
});

// 2. Tabela Kart (karty dostępne w sklepie)
export const ItemType = pgEnum("item_type", ["character", "weapon", "gadget"]);
export const ItemRarity = pgEnum("item_rarity", [
  "Common",
  "Uncommon",
  "Rare",
  "Legendary",
]);

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: ItemType("type").notNull(),
  rarity: ItemRarity("rarity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  createdAt,
});

// 3. Tabela Karty Użytkownika (karty należące do użytkowników, z ilością)
export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  cardId: integer("card_id")
    .references(() => cards.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  obtainedAt: timestamp("obtained_at").defaultNow(),
});

// 4. Tabela Transakcji
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id")
      .references(() => users.clerkUserId, { onDelete: "cascade" })
      .notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt,
  },
  (table) => ({
    idxUserClerkId: index("idx_user_clerk_id").on(table.clerkUserId),
  })
);

// 5. Tabela Szczegóły Transakcji (przechowuje informacje o kartach i ilościach w transakcji)
export const transactionItems = pgTable("transaction_items", {
  id: serial("id").primaryKey(),
  transactionId: uuid("transaction_id")
    .references(() => transactions.id, { onDelete: "cascade" })
    .notNull(),
  cardId: integer("card_id")
    .references(() => cards.id, { onDelete: "set null" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  priceAtPurchase: decimal("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
});
