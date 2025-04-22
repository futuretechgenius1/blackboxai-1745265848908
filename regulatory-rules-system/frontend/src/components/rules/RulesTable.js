import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAccess } from '../../context/AccessContext';
import { visuallyHidden } from '@mui/utils';

export default function RulesTable({
  rules,
  isLoading,
  page,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onEditRule,
  onSortChange
}) {
  const { isWriteAccess } = useAccess();
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('sequenceNumber');
  const [order, setOrder] = useState('asc');

  // Define table columns
  const columns = [
    { id: 'sequenceNumber', label: 'Sequence #', sortable: true },
    { id: 'ruleType', label: 'Rule Type', sortable: true },
    { id: 'mdState', label: 'MD State', sortable: true },
    { id: 'shipToState', label: 'Ship To State', sortable: true },
    { id: 'channel', label: 'Channel', sortable: true },
    { id: 'regCatCode', label: 'Reg Cat Code', sortable: true },
    { id: 'drugSchedule', label: 'Drug Schedule', sortable: true },
    { id: 'refillNumber', label: 'Refill #', sortable: true, numeric: true },
    { id: 'quantity', label: 'Quantity', sortable: true, numeric: true },
    { id: 'daysSupply', label: 'Days Supply', sortable: true, numeric: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(columnId);
    onSortChange?.(columnId, newOrder);
  };

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onPageSizeChange(parseInt(event.target.value, 10));
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: 4 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rules?.length) {
    return (
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No rules found. Try adjusting your filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.paper,
                    cursor: column.sortable ? 'pointer' : 'default',
                    '&:hover': column.sortable ? {
                      backgroundColor: theme.palette.action.hover,
                    } : {}
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow
                hover
                key={rule.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <TableCell>{rule.sequenceNumber}</TableCell>
                <TableCell>{rule.ruleType}</TableCell>
                <TableCell>{rule.mdState}</TableCell>
                <TableCell>{rule.shipToState}</TableCell>
                <TableCell>{rule.channel}</TableCell>
                <TableCell>{rule.regCatCode}</TableCell>
                <TableCell>{rule.drugSchedule}</TableCell>
                <TableCell align="right">{rule.refillNumber}</TableCell>
                <TableCell align="right">{rule.quantity}</TableCell>
                <TableCell align="right">{rule.daysSupply}</TableCell>
                <TableCell>
                  {isWriteAccess && onEditRule && (
                    <Tooltip title="Edit Rule">
                      <IconButton
                        size="small"
                        onClick={() => onEditRule(rule)}
                        color="primary"
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
        sx={{
          borderTop: 1,
          borderColor: 'divider'
        }}
      />
    </Paper>
  );
}
