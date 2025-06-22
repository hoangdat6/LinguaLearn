"use server";

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import authService from '@/services/auth-service';
import { AUTH } from '@/constants/api-endpoints';
import { createLogger } from '@/lib/logger';
import { publicApi } from '@/services/api';
const logger = createLogger('auth');

const CSRF_TOKEN = process.env.NEXT_PUBLIC_CSRF_TOKEN || "";

// Define consistent token expiration times that match the backend
const ACCESS_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds
const ACCESS_TOKEN_EXPIRY_MS = ACCESS_TOKEN_EXPIRY * 1000; // 7 days in milliseconds
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30; // 30 days in seconds
const REFRESH_BUFFER = 60 * 60 * 24; // 1 day buffer before expiry to refresh

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
      name: 'credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        logger.info("Authorizing user with credentials:", credentials?.username);
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
              accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRY_MS,
              user: response.data.user || { username: user.name, email: user.email }
            };
          } catch (error) {
            console.error("Google token exchange error:", error);
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
            
            // Store tokens from your backend with consistent expiry
            return {
              ...token,
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
              accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRY_MS,
              user: response.data.user || { username: user.name, email: user.email }
            };
          } catch (error) {
            console.error("Facebook token exchange error:", error);
            // Reject authentication by throwing an error
            throw new Error(error instanceof Error ? error.message : "Failed to authenticate with Facebook");
          }
        }
        
        // For credentials login
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRY_MS,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        };
      }

      // Return previous token if the access token has not expired yet
      // Add a buffer time to refresh token before it actually expires
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number) - REFRESH_BUFFER) {
        return token;
      }
      
      // Access token has expired or is about to expire, try to refresh it
      logger.info("Access token expired or about to expire, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user || session.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
        session.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth?tab=login',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
    maxAge: REFRESH_TOKEN_EXPIRY, // 30 days - match the refresh token expiry
  },
  debug: process.env.NODE_ENV === 'development',
});

// Helper function to refresh token
export async function refreshAccessToken(token: any) {
  try {
    logger.info("Attempting to refresh access token");
    
    // Make a request to the token endpoint with the refresh token
    const response = await publicApi.post(AUTH.REFRESH_TOKEN, { 
      refresh: token.refreshToken 
    });

    logger.info("Token refresh successful");
    
    // Get the new tokens
    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access,
      refreshToken: refreshedTokens.refresh || token.refreshToken, // Fall back to old refresh token
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRY_MS,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    
    // The error property will be used client-side to handle the refresh token error
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { handler as GET, handler as POST };