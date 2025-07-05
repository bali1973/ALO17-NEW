import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import NextAuth from 'next-auth';

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 Auth başladı - credentials:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credentials eksik');
          return null;
        }

        try {
          console.log('🔍 Kullanıcı aranıyor:', credentials.email);
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log('📋 Bulunan kullanıcı:', user ? { id: user.id, email: user.email, hasPassword: !!user.password } : 'null');

          if (!user) {
            console.log('❌ Kullanıcı bulunamadı:', credentials.email);
            return null;
          }

          if (!user.password) {
            console.log('❌ Kullanıcının şifresi yok:', credentials.email);
            return null;
          }

          console.log('🔐 Şifre kontrol ediliyor...');
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log('🔐 Şifre kontrol sonucu:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Şifre yanlış:', credentials.email);
            return null;
          }

          console.log('✅ Giriş başarılı:', credentials.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('💥 Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: '/giris',
    signOut: '/',
    error: '/giris',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔄 JWT callback:', { tokenId: token.id, userId: user?.id, userRole: (user as any)?.role });
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('🔄 Session callback:', { sessionUserId: session.user?.id, tokenId: token.id, tokenRole: token.role });
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

export const { auth, signIn, signOut } = NextAuth(authOptions); 