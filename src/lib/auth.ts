import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Auth: Giriş denemesi başladı');
        console.log('🔍 Auth: Environment variables:', {
          DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Not set',
        });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Auth: Email veya şifre eksik');
          throw new Error('Email ve şifre gerekli');
        }

        console.log('🔍 Auth: Kullanıcı aranıyor:', credentials.email);

        try {
          // Veritabanı bağlantısını test et
          await prisma.$connect();
          console.log('✅ Auth: Veritabanı bağlantısı başarılı');

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log('🔍 Auth: Kullanıcı bulundu mu:', !!user);

          if (!user || !user.password) {
            console.log('❌ Auth: Kullanıcı bulunamadı veya şifre yok');
            throw new Error('Kullanıcı bulunamadı');
          }

          console.log('✅ Auth: Kullanıcı bulundu, şifre kontrol ediliyor');

          const isPasswordValid = await compare(credentials.password, user.password);

          console.log('🔍 Auth: Şifre geçerli mi:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Auth: Şifre yanlış');
            throw new Error('Geçersiz şifre');
          }

          console.log('🎉 Auth: Giriş başarılı - Kullanıcı:', user.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('💥 Auth: Veritabanı hatası:', error);
          
          // Daha spesifik hata mesajları
          if (error instanceof Error) {
            if (error.message.includes('Kullanıcı bulunamadı')) {
              throw new Error('Kullanıcı bulunamadı');
            } else if (error.message.includes('Geçersiz şifre')) {
              throw new Error('Geçersiz şifre');
            } else if (error.message.includes('Email ve şifre gerekli')) {
              throw new Error('Email ve şifre gerekli');
            }
          }
          
          throw new Error('Veritabanı hatası');
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || '',
      clientSecret: process.env.APPLE_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/giris',
    signOut: '/',
    error: '/giris',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        console.log('🔄 JWT Callback: Token güncellendi');
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        console.log('🔄 Session Callback: Session güncellendi');
      }
      return session;
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

export const { auth, signIn, signOut } = NextAuth(authOptions); 