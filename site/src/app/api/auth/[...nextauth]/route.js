import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../model/user";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await dbConnect();

        // Hardcoded admin credentials
        if (credentials.email === "admin@h" && credentials.password === "password123") {
          return { id: 1, name: "Admin", email: "admin@h" };
        }

        // Check if user exists in the database
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with that email");
        }

        // Validate password
        const isValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the newsaddform page after login
      return baseUrl + "/newsaddform"; // Since it's a relative URL within the app
    },
  },
};

// Named exports for handling GET and POST
export const GET = async (req, res) => NextAuth(req, res, authOptions);
export const POST = async (req, res) => NextAuth(req, res, authOptions);
