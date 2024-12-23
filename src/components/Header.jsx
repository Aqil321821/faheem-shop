import React from 'react';
import { Card, Text, Avatar, Group } from '@mantine/core';
import { FiLogOut } from 'react-icons/fi'; // Import Feather Icons logout arrow icon

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
        <Text size='sm' weight={500} color='dark' style={{ display: 'flex', alignItems: 'center' }}>
          {user.name}
          <FiLogOut
            style={{ marginLeft: '8px', color: '#36454F', fontSize: '18px', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('user');
              window.location.reload();
            }}
          />
        </Text>
      </Group>
    </Card>
  );
}

export default Header;
