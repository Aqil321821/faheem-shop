import { Group, Select, Box, Title, Divider } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';

import React, { useEffect } from 'react';

function Filters({ setFilters, filters }) {
  useEffect(() => {
    console.log(filters);
  }, [filters]);

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
            { label: 'Last week', value: '7' },
            { label: 'Last two Weeks', value: '14' },
            { label: 'Last Month', value: '30' },
            { label: 'Last Three Months', value: '90' },
            { label: 'Last Year', value: '360' },
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

        {filters.frequency === 'custom-range' && <DateRangePicker label='Select dates' radius='md' size='md' transition='pop-top-left' transitionDuration={200} dropdownPosition='bottom' withinPortal={true} placeholder='Pick dates range' value={filters.dateRange} onChange={(value) => setFilters({ ...filters, dateRange: value })} />}

        <Select
          label='Transaction Type'
          placeholder='Income or Expense'
          data={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
            { label: 'All', value: 'all' },
          ]}
          value={filters.type}
          onChange={(value) => setFilters({ ...filters, type: value })}
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
          placeholder='Choose Category '
          data={[
            { label: 'Repairing', value: 'repairing' },
            { label: 'Accessories', value: 'accessories' },
          ]}
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
