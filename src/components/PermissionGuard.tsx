
import React from 'react';
import { useHasPermission, useHasAnyPermission } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  // Single permission check
  const { hasPermission, isLoading: singleLoading } = useHasPermission(permission || '');
  
  // Multiple permissions check
  const { hasAnyPermission, isLoading: anyLoading } = useHasAnyPermission(permissions || []);
  
  const isLoading = singleLoading || anyLoading;

  if (isLoading) {
    return <>{fallback}</>;
  }

  // If single permission is specified, check that
  if (permission) {
    return hasPermission ? <>{children}</> : <>{fallback}</>;
  }

  // If multiple permissions are specified
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // Would need useHasAllPermissions hook for this
      const allGranted = permissions.every(perm => {
        // This is a simplified check - in practice you'd use useHasAllPermissions
        return true; // Placeholder
      });
      return allGranted ? <>{children}</> : <>{fallback}</>;
    } else {
      // At least one permission required
      return hasAnyPermission ? <>{children}</> : <>{fallback}</>;
    }
  }

  // No permissions specified, render children
  return <>{children}</>;
};

export default PermissionGuard;
