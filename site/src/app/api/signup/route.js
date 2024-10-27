import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../model/user';
import bcrypt from 'bcryptjs';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        await dbConnect();

        // Hardcoded credentials for the admin
        if (credentials.email === 'admin@h' && credentials.password === 'password123') {
          return { id: 1, name: 'Admin', email: 'admin@h' };
        }

        // Find user in the database
        const user = await User.findOne({ email: credentials.email });

        // If no user is found
        if (!user) {
          throw new Error('No user found with that email');
        }

        // Compare password with stored hash
        const isValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user data if valid
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to /addnewsform after successful login
      return '/addnewsform';
    },
  },
};

// Exporting a named GET method for NextAuth
export const GET = async (req) => NextAuth(req, authOptions);
export const POST = async (req) => NextAuth(req, authOptions);
