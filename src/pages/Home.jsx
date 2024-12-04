import React, { useState } from 'react';
import Header from '../components/Header';
import { Box, Card, Button, Modal } from '@mantine/core';
import TransactionForm from '../components/TransactionForm';

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  return (
    <Box m={20} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
      <Header />
      <Card
        sx={{
          height: '80vh',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        withBorder
        mt={20}>
        <div className='flex justify-between '>
          <div>Filter</div>
          <div>
            <Button
              color='violet'
              onClick={() => {
                setShowForm(true);
                setFormMode('add');
              }}>
              Add Transaction
            </Button>
          </div>
        </div>
      </Card>

      <Modal size='lg' opened={showForm} onClose={() => setShowForm(false)} title={formMode === 'add' ? 'Add Transaction' : 'Edit Transaction'} centered>
        <TransactionForm formMode={formMode} setFormMode={setFormMode} setShowForm={setShowForm} showForm={showForm} />
      </Modal>
    </Box>
  );
}

export default Home;
