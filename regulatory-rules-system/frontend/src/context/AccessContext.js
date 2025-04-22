import React, { createContext, useContext, useState, useEffect } from 'react';
import { rulesApi } from '../services/api';
import { CircularProgress, Box } from '@mui/material';

const AccessContext = createContext();

export function useAccess() {
  return useContext(AccessContext);
}

export default function AccessProvider({ children }) {
  const [userAccess, setUserAccess] = useState({
    role: null,
    permissions: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserAccess = async () => {
      try {
        const response = await rulesApi.getUserAccess();
        setUserAccess({
          role: response.data.role,
          permissions: response.data.permissions,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching user access:', error);
        setUserAccess({
          role: null,
          permissions: [],
          isLoading: false,
          error: 'Failed to fetch user access rights'
        });
      }
    };

    fetchUserAccess();
  }, []);

  const hasPermission = (permission) => {
    return userAccess.permissions.includes(permission);
  };

  const isWriteAccess = () => {
    return userAccess.role === 'WRITE_ACCESS';
  };

  const value = {
    ...userAccess,
    hasPermission,
    isWriteAccess,
    // Additional helper methods
    canCreate: () => hasPermission('create'),
    canEdit: () => hasPermission('edit'),
    canExport: () => hasPermission('export'),
    // Expose loading and error states
    isLoading: userAccess.isLoading,
    error: userAccess.error
  };

  if (userAccess.isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userAccess.error) {
    // In a production environment, you might want to show a more user-friendly error message
    // or provide a way to retry fetching the access rights
    console.error('Access rights error:', userAccess.error);
  }

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
}

// Custom hook for components that need to check write access
export function useWriteAccess() {
  const { isWriteAccess, isLoading } = useAccess();
  return { hasWriteAccess: isWriteAccess(), isLoading };
}

// Custom hook for components that need specific permissions
export function usePermission(permission) {
  const { hasPermission, isLoading } = useAccess();
  return { hasPermission: hasPermission(permission), isLoading };
}

// Custom hook for components that need to check multiple permissions
export function usePermissions(permissions) {
  const { hasPermission, isLoading } = useAccess();
  const results = permissions.reduce((acc, permission) => {
    acc[permission] = hasPermission(permission);
    return acc;
  }, {});
  return { permissions: results, isLoading };
}
