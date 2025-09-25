import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email.");
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Incorrect password.");

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  // --- THIS IS THE CRITICAL FIX ---
  callbacks: {
    // This callback is triggered when a JWT is created or updated.
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, add user properties to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // If the session is updated (e.g., name change), update the token
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    // This callback creates the session object from the token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        // Ensure the name in the session matches the potentially updated token
        session.user.name = token.name; 
      }
      return session;
    }
  },
  // --- END OF FIX ---
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };