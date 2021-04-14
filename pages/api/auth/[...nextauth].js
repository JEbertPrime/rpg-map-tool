import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),
    Providers.Discord({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    process.env.DATABASE_URL
  ),
  callbacks: {
    // async signIn(user, account, profile) { return true },

    async session(session, user) {
      session.user.id = user.id;
      return session;
    },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },
  database: process.env.DATABASE_URL,
});
