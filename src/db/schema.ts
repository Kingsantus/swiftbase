import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  primaryKey,
  type AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { SQL, sql, relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// Custom function for lowercase email
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

// Define enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const actionEnum = pgEnum("action", ["send", "receive", "completed", "refund"]);

// Users Table
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(), // Ensure emails are lowercased before storing
    password: varchar("password", { length: 255 }).notNull(), // Should be hashed before storing
    emailVerified: timestamp("emailVerified", { mode: "date" }), 
    image: text("image"), 
    verified: boolean("verified").default(false).notNull(), 
    resetPassword: varchar("reset_password", { length: 255 }),
    role: roleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  })
);

// Wallets Table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  wallet: varchar("wallet", { length: 255 }).notNull(),
  chain: varchar("chain", { length: 255 }).notNull(),
  datakey: text("datakey").notNull(),
  authTag: text("authTag").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Transactions Table (Merged Send & Receive Transactions)
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  walletId: integer("wallet_id").references(() => wallets.id, { onDelete: "cascade" }).notNull(),
  transactionType: actionEnum("transaction_type").notNull(), // "send", "receive", or "refund"
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  counterpartyWallet: varchar("counterparty_wallet", { length: 255 }).notNull(), // Sender or Receiver Wallet
  amount: numeric("amount", { precision: 19, scale: 8 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Auth.js Accounts Table
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

// Sessions Table
export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens Table
export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

// Authenticators Table
export const authenticators = pgTable(
  "authenticators",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
}));
