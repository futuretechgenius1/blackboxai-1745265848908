import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Collapse,
  useTheme
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function RuleFilters({ fieldMetadata, filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  // Reset local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value || undefined // Remove empty values
    };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Remove undefined/null/empty string values
    const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    onFilterChange(cleanFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const renderFilterField = (field) => {
    switch (field.type) {
      case 'dropdown':
        return (
          <TextField
            select
            fullWidth
            label={field.label}
            value={localFilters[field.field] || ''}
            onChange={(e) => handleFilterChange(field.field, e.target.value)}
            size="small"
            onKeyPress={handleKeyPress}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {field.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={localFilters[field.field] || ''}
            onChange={(e) => handleFilterChange(field.field, e.target.value)}
            size="small"
            onKeyPress={handleKeyPress}
            InputProps={{
              inputProps: {
                min: field.min,
                max: field.max
              }
            }}
          />
        );

      default: // text
        return (
          <TextField
            fullWidth
            label={field.label}
            value={localFilters[field.field] || ''}
            onChange={(e) => handleFilterChange(field.field, e.target.value)}
            size="small"
            onKeyPress={handleKeyPress}
          />
        );
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: expanded ? 2 : 0
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <FilterAltIcon color="primary" />
          <Typography variant="h6" component="h2">
            Filters
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="toggle filters"
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2} alignItems="flex-start">
          {/* Filter Fields */}
          {fieldMetadata?.map((field) => (
            <Grid item xs={12} sm={6} md={3} key={field.field}>
              {renderFilterField(field)}
            </Grid>
          ))}

          {/* Action Buttons */}
          <Grid item xs={12} sm={6} md={3} sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: 1 
          }}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              size="small"
            >
              Apply Filters
            </Button>
            
            <Tooltip title="Clear all filters">
              <IconButton 
                onClick={handleClearFilters}
                size="small"
                sx={{ ml: 1 }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Active Filters Summary */}
        {Object.keys(localFilters).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Active Filters: {Object.entries(localFilters)
                .filter(([, value]) => value !== undefined && value !== '')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
            </Typography>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}
