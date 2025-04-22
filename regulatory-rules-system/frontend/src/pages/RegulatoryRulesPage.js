import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { rulesApi, queryKeys } from '../services/api';
import { useAccess } from '../context/AccessContext';
import RulesTable from '../components/rules/RulesTable';
import RuleFilters from '../components/rules/RuleFilters';
import RuleForm from '../components/rules/RuleForm';

export default function RegulatoryRulesPage() {
  const theme = useTheme();
  const { isWriteAccess, canCreate } = useAccess();
  const queryClient = useQueryClient();
  
  // State management
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('sequenceNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Fetch field metadata
  const { data: fieldMetadata, isLoading: isLoadingMetadata, error: metadataError } = useQuery(
    [queryKeys.fieldMetadata],
    () => rulesApi.getFieldMetadata().then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // Consider metadata stable for 5 minutes
      cacheTime: 30 * 60 * 1000 // Cache for 30 minutes
    }
  );

  // Fetch rules with filters and pagination
  const {
    data: rulesData,
    isLoading: isLoadingRules,
    error: rulesError,
    refetch: refetchRules
  } = useQuery(
    [queryKeys.rules, filters, page, pageSize, sortField, sortOrder],
    () => rulesApi.getRules({
      ...filters,
      page,
      size: pageSize,
      sort: `${sortField},${sortOrder}`
    }).then(res => res.data),
    {
      keepPreviousData: true
    }
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page when page size changes
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleAddRule = () => {
    setSelectedRule(null);
    setIsFormOpen(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRule(null);
  };

  const handleFormSubmit = async () => {
    await refetchRules();
    handleFormClose();
    setNotification({
      open: true,
      message: `Rule successfully ${selectedRule ? 'updated' : 'created'}`,
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (metadataError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading field metadata: {metadataError.message}
      </Alert>
    );
  }

  if (isLoadingMetadata) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h5" component="h1" color="primary">
          Regulatory Rules
        </Typography>
        {canCreate() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRule}
          >
            Add New Rule
          </Button>
        )}
      </Box>

      <Divider />

      {/* Filters Section */}
      <RuleFilters
        fieldMetadata={fieldMetadata}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Error Display */}
      {rulesError && (
        <Alert severity="error">
          Error loading rules: {rulesError.message}
        </Alert>
      )}

      {/* Rules Table */}
      <RulesTable
        rules={rulesData?.content || []}
        isLoading={isLoadingRules}
        page={page}
        pageSize={pageSize}
        totalElements={rulesData?.totalElements || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEditRule={isWriteAccess ? handleEditRule : undefined}
        onSortChange={handleSortChange}
      />

      {/* Rule Form Dialog */}
      {isFormOpen && (
        <RuleForm
          open={isFormOpen}
          rule={selectedRule}
          fieldMetadata={fieldMetadata}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
