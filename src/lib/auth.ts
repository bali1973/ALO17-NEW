import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

// Vercel için hardcoded kullanıcılar (SQLite yerine)
const hardcodedUsers = [
  {
    id: '1',
    email: 'admin@alo17.com',
    name: 'Admin User',
    password: 'admin123', // Plain text for demo
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@alo17.com',
    name: 'Normal User',
    password: 'user123', // Plain text for demo
    role: 'user'
  },
  {
    id: '3',
    email: 'test@alo17.com',
    name: 'Test User',
    password: 'test123', // Plain text for demo
    role: 'user'
  }
];

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
          
          // Hardcoded kullanıcılardan ara
          const user = hardcodedUsers.find(u => u.email === credentials.email);

          console.log('📋 Bulunan kullanıcı:', user ? { id: user.id, email: user.email, hasPassword: !!user.password } : 'null');

          if (!user) {
            console.log('❌ Kullanıcı bulunamadı:', credentials.email);
            return null;
          }

          console.log('🔐 Şifre kontrol ediliyor...');
          // Plain text password comparison for demo
          const isPasswordValid = credentials.password === user.password;
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