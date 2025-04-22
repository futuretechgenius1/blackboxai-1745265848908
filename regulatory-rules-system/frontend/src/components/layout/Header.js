import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAccess } from '../../context/AccessContext';
import { rulesApi, downloadFile } from '../../services/api';

export default function Header() {
  const { role, isLoading, canExport } = useAccess();
  const theme = useTheme();

  const getRoleColor = () => {
    if (role === 'WRITE_ACCESS') return theme.palette.success.main;
    if (role === 'READ_ONLY') return theme.palette.info.main;
    return theme.palette.grey[500];
  };

  const handleExport = async () => {
    try {
      const response = await rulesApi.exportRules();
      downloadFile(response.data, 'regulatory-rules.csv');
    } catch (error) {
      console.error('Export failed:', error);
      // In a production environment, you would want to show a user-friendly error message
      // using a snackbar or alert component
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Regulatory Rules Maintenance System
        </Typography>
        
        {!isLoading && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            {canExport() && (
              <Tooltip title="Export Rules">
                <IconButton
                  onClick={handleExport}
                  color="primary"
                  aria-label="export data"
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Chip
              label={`Access: ${role || 'Unknown'}`}
              size="small"
              sx={{
                backgroundColor: getRoleColor(),
                color: '#fff',
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 2
                },
                minWidth: 120,
                justifyContent: 'center'
              }}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
