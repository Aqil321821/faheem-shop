import { Group, Select, Box, Title, Divider } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import React, { useEffect, useState } from 'react';

function Filters({ setFilters, filters }) {
  // State for dynamic categories based on type selection
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  // Handle the type change (Income or Expense)
  const handleTypeChange = (value) => {
    // Update the 'type' filter
    setFilters({ ...filters, type: value, category: '' }); // Reset category when type changes

    // Set categories dynamically based on the selected type
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
      setCategoryOptions([]); // If type is "All" or empty, no categories should be available
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
      <Group spacing='md' grow>
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
        />

        {filters.frequency === 'custom-range' && <DateRangePicker label='Select dates' size='md' radius='md' transition='pop-top-left' transitionDuration={200} dropdownPosition='bottom' withinPortal={true} placeholder='Pick dates range' onChange={(value) => setFilters({ ...filters, dateRange: value })} />}

        <Select
          label='Transaction Type'
          placeholder='Income or Expense'
          data={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
            { label: 'All', value: '' },
          ]}
          value={filters.type}
          onChange={(value) => handleTypeChange(value)} // Handle type change
          radius='md'
          size='md'
          transition='pop-top-left'
          transitionDuration={200}
          dropdownPosition='bottom'
          withinPortal={true}
          name='type'
        />

        <Select
          label='Category Type'
          placeholder='Choose Category'
          data={categoryOptions} // Dynamically set options based on type
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value })}
          radius='md'
          size='md'
          transition='pop-top-left'
          transitionDuration={200}
          dropdownPosition='bottom'
          withinPortal={true}
          name='category'
        />
      </Group>
    </Box>
  );
}

export default Filters;
