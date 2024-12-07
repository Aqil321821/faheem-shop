import { Group, Select, Box, Title, Divider } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
import '../stylesheets/filters.css';

function Filters({ setFilters, filters }) {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handleTypeChange = (value) => {
    setFilters({ ...filters, type: value, category: '' });
    if (value === 'income') {
      setCategoryOptions([
        { label: 'Repairing', value: 'repairing' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Mobile Sale', value: 'mobile-sale' },
        { label: 'Other', value: 'other' },
      ]);
    } else if (value === 'expense') {
      setCategoryOptions([
        { label: 'Repairing things', value: 'repairing' },
        { label: 'Mobile Purchase', value: 'mobile-purchase' },
        { label: 'Rent', value: 'rent' },
        { label: 'Salary', value: 'salary' },
        { label: 'Bills', value: 'bill' },
        { label: 'Food', value: 'food' },
        { label: 'Other', value: 'other' },
      ]);
    } else {
      setCategoryOptions([]);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[0],
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.sm,
      })}
      className='aqil-2'>
      <Title order={4} align='center' mb='md'>
        Filter Transactions
      </Title>
      <Divider my='sm' />

      {/* Group with spacing and full width */}
      <Group spacing='md' grow direction={{ base: 'column', sm: 'row' }}>
        {/* Frequency Select */}
        <Select
          label='Frequency'
          placeholder='Choose a time frame'
          data={[
            { label: 'Today', value: 'today' },
            { label: 'Last week', value: '7' },
            { label: 'Last two Weeks', value: '14' },
            { label: 'Last Month', value: '30' },
            { label: 'Last Three Months', value: '90' },
            { label: 'Last Year', value: '365' },
            { label: 'Custom Range', value: 'custom-range' },
          ]}
          value={filters.frequency}
          onChange={(value) => setFilters({ ...filters, frequency: value })}
          radius='md'
          size='md'
          transition='pop-top-left'
          transitionDuration={200}
          dropdownPosition='bottom'
          withinPortal={true}
          name='frequency'
          sx={{
            width: '100%', // Full width on smaller screens
            maxWidth: '250px', // Max width for larger screens
          }}
        />

        {/* DateRangePicker (visible only if custom range is selected) */}
        {filters.frequency === 'custom-range' && (
          <DateRangePicker
            label='Select dates'
            size='md'
            radius='md'
            transition='pop-top-left'
            transitionDuration={200}
            dropdownPosition='bottom'
            withinPortal={true}
            placeholder='Pick dates range'
            onChange={(value) => setFilters({ ...filters, dateRange: value })}
            sx={{
              width: '100%', // Full width on smaller screens
              maxWidth: '250px', // Max width for larger screens
            }}
          />
        )}

        {/* Transaction Type Select */}
        <Select
          label='Transaction Type'
          placeholder='Income or Expense'
          data={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
            { label: 'All', value: '' },
          ]}
          value={filters.type}
          onChange={(value) => handleTypeChange(value)}
          radius='md'
          size='md'
          transition='pop-top-left'
          transitionDuration={200}
          dropdownPosition='bottom'
          withinPortal={true}
          name='type'
          sx={{
            width: '100%', // Full width on smaller screens
            maxWidth: '250px', // Max width for larger screens
          }}
        />

        {/* Category Select */}
        <Select
          label='Category Type'
          placeholder='Choose Category'
          data={categoryOptions}
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value })}
          radius='md'
          size='md'
          transition='pop-top-left'
          transitionDuration={200}
          dropdownPosition='bottom'
          withinPortal={true}
          name='category'
          sx={{
            width: '100%', // Full width on smaller screens
            maxWidth: '300px', // Max width for larger screens
          }}
        />
      </Group>
    </Box>
  );
}

export default Filters;
