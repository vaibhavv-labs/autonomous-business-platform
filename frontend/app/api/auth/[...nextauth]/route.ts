import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          }),
        ]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isGuest: { label: "isGuest", type: "text" },
      },
      async authorize(credentials) {
        // Handle Guest Login
        if (credentials?.isGuest === "true") {
          return {
            id: "guest_" + Math.random().toString(36).substring(2, 9),
            name: "Guest User",
            email: "guest@abp-platform.ai",
            image: "https://api.dicebear.com/7.x/bottts/svg?seed=ABP_Guest",
          };
        }

        const email = credentials?.email?.trim();
        const password = credentials?.password;
        const name = credentials?.name?.trim();

        if (!email || !password) {
          throw new Error("Please fill in all required fields.");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        // Generate user representation
        const userName = name || email.split("@")[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

        return {
          id: Buffer.from(email).toString("base64"),
          name: formattedName,
          email: email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
          const provider = account?.provider ? account.provider.toUpperCase() : "UNKNOWN";
          const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

          const message = `🔐 *New User Login Notification*\n\n` +
            `👤 *Name:* ${user.name || "N/A"}\n` +
            `📧 *Email:* ${user.email || "N/A"}\n` +
            `🔑 *Provider:* ${provider}\n` +
            `🕒 *Time:* ${now} IST\n` +
            `🚀 *Platform:* Autonomous Business Platform`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "Markdown",
            }),
          });
        }
      } catch (err) {
        console.error("Failed to send Telegram login notification:", err);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string }).id = (token.id as string) || (token.sub as string);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
