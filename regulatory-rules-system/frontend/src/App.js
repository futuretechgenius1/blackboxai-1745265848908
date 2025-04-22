import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Container } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import theme from './theme';
import AccessProvider from './context/AccessContext';
import Header from './components/layout/Header';
import RegulatoryRulesPage from './pages/RegulatoryRulesPage';

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <AccessProvider>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              bgcolor: 'background.default'
            }}>
              <Header />
              <Container 
                component="main" 
                maxWidth="xl" 
                sx={{ 
                  flex: 1, 
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/rules" replace />} />
                  <Route path="/rules" element={<RegulatoryRulesPage />} />
                  {/* Add more routes here as needed */}
                  <Route path="*" element={<Navigate to="/rules" replace />} />
                </Routes>
              </Container>
            </Box>
          </AccessProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
