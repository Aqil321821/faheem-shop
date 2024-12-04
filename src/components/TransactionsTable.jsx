import React from 'react';
import { Table, ScrollArea, Text, Badge, ActionIcon, Tooltip, Group } from '@mantine/core';
import { IconPencil, IconTrash, IconPrinter } from '@tabler/icons-react';
import jsPDF from 'jspdf';
import moment from 'moment';

function TransactionsTable({ transactions, setSelectedTransaction, setFormMode, setShowForm, handleDelete }) {
  // Function to generate a receipt PDF
  const printReceipt = (transaction) => {
    const doc = new jsPDF('p', 'mm', [80, 180]); // A6 size (80mm x 180mm)

    // Heading "Mobile's O'Clock"
    doc.setFontSize(18);
    doc.text("Mobile's O'Clock", 10, 10);

    // "Contact No" below the heading with smaller font size
    doc.setFontSize(8);
    doc.text('Contact No: 03053537532', 10, 20);

    // Adding a line after heading
    doc.setLineWidth(0.5);
    doc.line(10, 22, 70, 22); // Horizontal line below the heading

    // Vertically aligned headers and values
    const headerY = 30;
    const dataY = 30;
    const columnSpacing = 10; // Increase spacing between rows

    // Headers (vertically)
    const headers = ['Name', 'Amount', 'Date', 'Category', 'Reference', 'Description'];
    const values = [transaction.name, `$${transaction.amount}`, moment(transaction.date).format('DD-MM-YYYY'), transaction.category, transaction.reference || '-', transaction.description || 'No description'];

    // Printing headers vertically
    headers.forEach((header, idx) => {
      doc.setFontSize(10);
      doc.text(header, 10, headerY + idx * columnSpacing);
    });

    // Printing values vertically in second column
    values.forEach((value, idx) => {
      doc.setFontSize(10);
      doc.text(value, 40, dataY + idx * columnSpacing);
    });

    // Save the PDF
    doc.save(`Transaction_${transaction.name}.pdf`);
  };

  // Generate rows for the table
  const getRows = transactions.map((transaction) => (
    <tr key={transaction.id}>
      <td>
        <Text weight={500}>{transaction.name}</Text>
      </td>
      <td>
        <Badge color={transaction.type === 'income' ? 'green' : 'red'} variant='light'>
          {transaction.type}
        </Badge>
      </td>
      <td>
        <Text>{`$${transaction.amount}`}</Text>
      </td>
      <td>
        <Text>{moment(transaction.date).format('DD-MM-YYYY')}</Text>
      </td>
      <td>
        <Text>{transaction.category}</Text>
      </td>
      <td>
        <Text>{transaction.reference || '-'}</Text>
      </td>
      <td>
        <Text>{transaction.description || 'No description'}</Text>
      </td>
      <td>
        <Group spacing='xs'>
          <Tooltip label='Edit' position='top' withArrow>
            <ActionIcon color='blue' variant='light'>
              <IconPencil
                color='blue'
                size={16}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setFormMode('edit');
                  setShowForm(true);
                }}
              />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Delete' position='top' withArrow>
            <ActionIcon color='red' variant='light' onClick={() => handleDelete(transaction.id)}>
              <IconTrash color='red' size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Print Receipt' position='top' withArrow>
            <ActionIcon color='teal' variant='light' onClick={() => printReceipt(transaction)}>
              <IconPrinter color='teal' size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table striped highlightOnHover verticalSpacing='md' horizontalSpacing='lg' sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px', overflow: 'scroll' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{getRows}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default TransactionsTable;
