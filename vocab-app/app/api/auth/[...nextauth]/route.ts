"use server";

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import authService from '@/services/auth-service';
import { AUTH } from '@/constants/api-endpoints';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/";
const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    }),
    // Facebook provider can be added similarly
    FacebookProvider({
      clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'email public_profile user_friends'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        try {
          const data = await authService.login(
            credentials.username,
            credentials.password
          )

          if (data) {
            // Return the tokens and any user data
            return {
              id: data.user?.id || "unknown",
              name: data.user?.name || credentials.username,
              email: data.user?.email,
              accessToken: data.access,
              refreshToken: data.refresh,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // If the user is signing in with Google, exchange the token
        if (account.provider === 'google') {
          try {
            // Exchange Google token for your backend tokens
            const response = await axios.post(
              AUTH.GOOGLE_LOGIN,
              { id_token: account.id_token },
              {
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "X-CSRFTOKEN": CSRF_TOKEN,
                },
              }
            );
            
            // Store tokens from your backend
            return {
              ...token,
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
              user: response.data.user || { username: user.name, email: user.email }
            };
          } catch (error) {
            console.error("Google token exchange error:", error);
            // Reject authentication by throwing an error
            // This will redirect to the error page with the appropriate error message
            throw new Error(error instanceof Error ? error.message : "Failed to authenticate with Google");
          }
        }

        // if the user is signing in with Facebook, exchange the token
        if (account.provider === 'facebook') {
          try {
            // Exchange Facebook token for your backend tokens
            const response = await axios.post(
              AUTH.FACEBOOK_LOGIN,
              { access_token: account.access_token },
              {
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "X-CSRFTOKEN": CSRF_TOKEN,
                },
              }
            );
            
            // Store tokens from your backend
            return {
              ...token,
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
              user: response.data.user || { username: user.name, email: user.email }
            };
          } catch (error) {
            console.error("Facebook token exchange error:", error);
            // Reject authentication by throwing an error
            throw new Error(error instanceof Error ? error.message : "Failed to authenticate with Facebook");
          }
        }
        
        // For credentials provider, user already contains tokens
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        };
      }

      // Return previous token if the access token has not expired
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user || session.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    }
  },
  pages: {
    signIn: AUTH.LOGIN,
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
