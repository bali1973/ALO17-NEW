'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Admin yetki tipleri
export type AdminPermission = 
  | 'dashboard:read'
  | 'users:read'
  | 'users:write'
  | 'listings:read'
  | 'listings:write'
  | 'listings:approve'
  | 'listings:delete'
  | 'messages:read'
  | 'messages:write'
  | 'statistics:read'
  | 'settings:read'
  | 'settings:write'
  | 'premium:read'
  | 'premium:write'
  | 'categories:read';

// Admin rol tipleri
export type AdminRole = 'super_admin' | 'admin' | 'moderator';

// Admin kullanıcı tipi
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Yetki matrisi - her rolün hangi yetkilere sahip olduğunu tanımlar
const PERMISSION_MATRIX: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'dashboard:read',
    'users:read',
    'users:write',
    'listings:read',
    'listings:write',
    'listings:approve',
    'listings:delete',
    'messages:read',
    'messages:write',
    'statistics:read',
    'settings:read',
    'settings:write',
    'premium:read',
    'premium:write',
    'categories:read'
  ],
  admin: [
    'dashboard:read',
    'users:read',
    'listings:read',
    'listings:write',
    'listings:approve',
    'listings:delete',
    'messages:read',
    'messages:write',
    'statistics:read',
    'settings:read',
    'premium:read',
    'categories:read'
  ],
  moderator: [
    'dashboard:read',
    'listings:read',
    'listings:approve',
    'listings:delete',
    'listings:write',
    'messages:read',
    'statistics:read'
  ]
};

// Test admin kullanıcıları (gerçek uygulamada veritabanından gelecek)
const TEST_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@alo17.com',
    name: 'Admin User',
    role: 'super_admin',
    permissions: PERMISSION_MATRIX.super_admin,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'moderator@alo17.com',
    name: 'Moderator User',
    role: 'moderator',
    permissions: PERMISSION_MATRIX.moderator,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'bali@alo17.com',
    name: 'Bali',
    role: 'super_admin',
    permissions: PERMISSION_MATRIX.super_admin,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Admin Auth Context
interface AdminAuthContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  hasPermission: (permission: AdminPermission) => boolean;
  hasRole: (role: AdminRole) => boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin Auth Provider Props
interface AdminAuthProviderProps {
  children: ReactNode;
}

// Admin Auth Provider
export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local storage'dan admin kullanıcı bilgisini al
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
      } catch (err) {
        console.error('Stored admin data is invalid:', err);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Test kullanıcılarından kontrol et
      const admin = TEST_ADMIN_USERS.find(user => user.email === email);
      
      if (admin && password === 'admin123') { // Test şifresi
        setAdminUser(admin);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        localStorage.setItem('alo17-admin-token', 'alo17admin'); // .env'deki ADMIN_TOKEN ile aynı olmalı
        return true;
      } else {
        setError('Geçersiz email veya şifre');
        return false;
      }
    } catch (err) {
      setError('Giriş yapılırken hata oluştu');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!adminUser) return false;
    
    const rolePermissions = PERMISSION_MATRIX[adminUser.role] || [];
    return rolePermissions.includes(permission);
  };

  const hasRole = (role: AdminRole): boolean => {
    if (!adminUser) return false;
    
    // Rol hiyerarşisi: super_admin > admin > moderator
    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      moderator: 1
    };
    
    const userRoleLevel = roleHierarchy[adminUser.role] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const value: AdminAuthContextType = {
    isAdmin: !!adminUser,
    adminUser,
    hasPermission,
    hasRole,
    isLoading,
    error,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Admin Auth Hook
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Admin Guard Component
interface AdminGuardProps {
  children: ReactNode;
  permission?: AdminPermission;
  role?: AdminRole;
  fallback?: ReactNode;
}

export function AdminGuard({ 
  children, 
  permission, 
  role, 
  fallback = <div>Bu sayfaya erişim yetkiniz bulunmamaktadır.</div> 
}: AdminGuardProps) {
  const { isAdmin, hasPermission, hasRole, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Admin Route Guard Component
interface AdminRouteGuardProps {
  children: ReactNode;
  permission?: AdminPermission;
  role?: AdminRole;
  fallback?: ReactNode;
}

export function AdminRouteGuard({ 
  children, 
  permission, 
  role, 
  fallback = <div>Bu sayfaya erişim yetkiniz bulunmamaktadır.</div> 
}: AdminRouteGuardProps) {
  const { hasPermission, hasRole } = useAdminAuth();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Admin Permission Check Component
interface AdminPermissionCheckProps {
  permission: AdminPermission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminPermissionCheck({ 
  permission, 
  children, 
  fallback = null 
}: AdminPermissionCheckProps) {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// PermissionGuard alias for AdminPermissionCheck
interface PermissionGuardProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  // Basit örnek: Herkese izin ver
  const hasPermission = true;
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

// Admin Role Check Component
interface AdminRoleCheckProps {
  role: AdminRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminRoleCheck({ 
  role, 
  children, 
  fallback = null 
}: AdminRoleCheckProps) {
  const { hasRole } = useAdminAuth();

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Utility functions
export const adminUtils = {
  // Yetki kontrolü
  checkPermission: (userPermissions: AdminPermission[], requiredPermission: AdminPermission): boolean => {
    return userPermissions.includes(requiredPermission);
  },

  // Rol kontrolü
  checkRole: (userRole: AdminRole, requiredRole: AdminRole): boolean => {
    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      moderator: 1
    };
    
    const userRoleLevel = roleHierarchy[userRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  },

  // Rol adını Türkçe'ye çevir
  getRoleName: (role: AdminRole): string => {
    const roleNames: Record<AdminRole, string> = {
      super_admin: 'Süper Admin',
      admin: 'Admin',
      moderator: 'Moderatör'
    };
    return roleNames[role] || role;
  },

  // Yetki adını Türkçe'ye çevir
  getPermissionName: (permission: AdminPermission): string => {
    const permissionNames: Record<AdminPermission, string> = {
      'dashboard:read': 'Dashboard Görüntüleme',
      'users:read': 'Kullanıcı Görüntüleme',
      'users:write': 'Kullanıcı Düzenleme',
      'listings:read': 'İlan Görüntüleme',
      'listings:write': 'İlan Düzenleme',
      'listings:approve': 'İlan Onaylama',
      'listings:delete': 'İlan Silme',
      'messages:read': 'Mesaj Görüntüleme',
      'messages:write': 'Mesaj Düzenleme',
      'statistics:read': 'İstatistik Görüntüleme',
      'settings:read': 'Ayarlar Görüntüleme',
      'settings:write': 'Ayarlar Düzenleme',
      'premium:read': 'Premium Görüntüleme',
      'premium:write': 'Premium Düzenleme',
      'categories:read': 'Kategori Görüntüleme'
    };
    return permissionNames[permission] || permission;
  }
}; 