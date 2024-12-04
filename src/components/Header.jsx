import React from 'react';
import { Card, Text, Avatar, Group } from '@mantine/core';

function Header() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

  return (
    <Card
      shadow='md'
      withBorder
      p={20}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
      <Text size='xl' weight={700} style={{ color: '#36454F' }}>
        Faheem's Shop
      </Text>
      <Group spacing='sm'>
        <Avatar radius='xl' style={{ color: '#36454F' }}>
          {user?.name?.charAt(0) || 'G'}
        </Avatar>
        <Text size='sm' weight={500} color='dark'>
          {user.name}
        </Text>
      </Group>
    </Card>
  );
}

export default Header;
