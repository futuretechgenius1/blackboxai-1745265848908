import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rulesApi, formatErrorMessage, queryKeys } from '../../services/api';

export default function RuleForm({ open, rule, fieldMetadata, onClose }) {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const theme = useTheme();
  const queryClient = useQueryClient();

  // Initialize form data when rule changes
  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      // Initialize with default values from metadata
      const defaultData = fieldMetadata.reduce((acc, field) => {
        if (field.type === 'number') {
          acc[field.field] = field.min || 0;
        } else {
          acc[field.field] = '';
        }
        return acc;
      }, {});
      setFormData(defaultData);
    }
    setValidationErrors({});
  }, [rule, fieldMetadata]);

  // Mutations for creating and updating rules
  const createMutation = useMutation(
    (data) => rulesApi.createRule(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.rules);
        onClose();
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => rulesApi.updateRule(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.rules);
        onClose();
      }
    }
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when field is modified
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    fieldMetadata.forEach(field => {
      // Required field validation
      if (field.required && !formData[field.field]) {
        errors[field.field] = `${field.label} is required`;
      }

      // Numeric field validation
      if (field.type === 'number') {
        const value = formData[field.field];
        if (value !== undefined && value !== '') {
          if (field.min !== undefined && value < field.min) {
            errors[field.field] = `Minimum value is ${field.min}`;
          }
          if (field.max !== undefined && value > field.max) {
            errors[field.field] = `Maximum value is ${field.max}`;
          }
        }
      }
    });

    // Business logic validations
    if (formData.maxDaysSupply !== undefined && formData.daysSupply !== undefined &&
        formData.daysSupply > formData.maxDaysSupply) {
      errors.daysSupply = 'Days supply cannot exceed max days supply';
    }

    if (formData.maxQuantity !== undefined && formData.quantity !== undefined &&
        formData.quantity > formData.maxQuantity) {
      errors.quantity = 'Quantity cannot exceed max quantity';
    }

    if (formData.maxRefill !== undefined && formData.refillNumber !== undefined &&
        formData.refillNumber > formData.maxRefill) {
      errors.refillNumber = 'Refill number cannot exceed max refill';
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      if (rule?.id) {
        await updateMutation.mutateAsync({ id: rule.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      // API errors will be handled by the mutation
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;
  const error = createMutation.error || updateMutation.error;

  const renderField = (field) => {
    const error = validationErrors[field.field];
    const commonProps = {
      fullWidth: true,
      label: field.label,
      value: formData[field.field] || '',
      onChange: (e) => handleChange(field.field, e.target.value),
      error: !!error,
      helperText: error,
      required: field.required,
      disabled: isLoading,
      size: "medium"
    };

    switch (field.type) {
      case 'dropdown':
        return (
          <TextField
            {...commonProps}
            select
          >
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
            {...commonProps}
            type="number"
            InputProps={{
              inputProps: {
                min: field.min,
                max: field.max
              }
            }}
          />
        );

      default:
        return <TextField {...commonProps} />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isLoading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          {rule ? 'Edit Rule' : 'Add New Rule'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
          >
            {formatErrorMessage(error)}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {fieldMetadata.map((field) => (
            <Grid item xs={12} sm={6} key={field.field}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {rule ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
