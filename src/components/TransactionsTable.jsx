import React, { useState } from 'react'; // Fixed: Added useState import
import { Table, ScrollArea, Text, Badge, ActionIcon, Tooltip, Group, Modal, TextInput, Button } from '@mantine/core';
import { IconPencil, IconTrash, IconPrinter } from '@tabler/icons-react';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { deleteDoc, doc } from 'firebase/firestore';
import { fireDB } from '../firebase';
import 'jspdf-autotable'; // You can use this library if necessary to format tables properly
import { showNotification } from '@mantine/notifications';

function TransactionsTable({ transactions, setSelectedTransaction, setFormMode, setShowForm, onTransactionAdded }) {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState(''); // 'delete' or 'edit'
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const VALID_PASSWORD = 'aqil3218'; // Hardcoded owner password

  // Open Modal for Delete/Edit
  const handleActionClick = (type, transactionId) => {
    setActionType(type); // 'delete' or 'edit'
    setSelectedTransactionId(transactionId);
    setPasswordModalOpen(true);
  };

  const validatePassword = () => {
    if (password.trim() === VALID_PASSWORD) {
      setPasswordModalOpen(false); // Close Modal
      if (actionType === 'delete') {
        handleDelete(selectedTransactionId); // Call delete handler
      } else if (actionType === 'edit') {
        const transactionToEdit = transactions.find((txn) => txn.id === selectedTransactionId);
        setSelectedTransaction(transactionToEdit);
        setFormMode('edit');
        setShowForm(true); // Open Edit Form
      }
    } else {
      alert('Invalid Password'); // Show error if password is wrong
    }
    setPassword(''); // Clear password field
  };

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
    const columnSpacing = 7; // Increase spacing between rows

    // Headers (vertically)
    const headers = ['Name', 'Amount', 'Date', 'Category', 'Reference', 'Description'];
    const values = [transaction.name, `Rs. ${transaction.amount}`, moment(transaction.date).format('DD-MM-YYYY'), transaction.category, transaction.reference || '-', transaction.description || 'No description'];

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

    // Adding the Legal Notes section in Roman English
    doc.setFontSize(9);
    const noteY = dataY + values.length * columnSpacing + 10; // Position for the notes section
    doc.text(' Please Note :', 5, noteY); // Title for notes

    const legalNotes = ['1. Please apna mobile 15 din ke andar le jayein, uske baad hamari zimmedari nahi hogi.', '2. Agar repair ke dauran mobile dead ho gaya, to shop responsible nahi hoga.', '3. Seal pack mobile ki warranty customer ko khud company se ja kar claim karni hogi.', '4. Warranty sirf original receipt ke saath valid hogi.', '5. Repair ke baad agar koi nuksan hota hai to hamari zimmedari nahi hogi.', '6. Service charges repair shuru karne ke baad liye jaenge.', 'Remarks :-'];

    // Add line breaks and print each legal note
    let currentY = noteY + 10; // Adjust Y position after title

    legalNotes.forEach((note) => {
      // Check if the note fits in the page, else break into new lines
      const lines = doc.splitTextToSize(note, 70); // 70 is the max width for text
      const xCoordinate = 5; // Start from X = 10 to avoid pushing too much right
      lines.forEach((line, idx) => {
        doc.text(line, xCoordinate, currentY + idx * 5); // Adjust Y position
      });
      currentY += lines.length * 5; // Move Y position after each note
    });

    // Save the PDF
    doc.save(`Transaction_${transaction.name}.pdf`);
  };

  const handleDelete = async (id) => {
    console.log(user.id);
    console.log('Delete initiated for transaction:', id);

    try {
      dispatch(ShowLoading());
      await deleteDoc(doc(fireDB, `users/${user.id}/transactions`, id)); // Fixed: Corrected the path
      dispatch(HideLoading());
      showNotification({
        title: 'Transaction deleted',
        color: 'green',
      });
      onTransactionAdded();
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: 'Error during Transaction deletion',
        message: error.message, // Add error message for debugging
        color: 'red',
      });
    }
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
        <Text>{`${transaction.amount} /-`}</Text>
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
            <ActionIcon color='blue' variant='light' onClick={() => handleActionClick('edit', transaction.id)}>
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Delete' position='top' withArrow>
            <ActionIcon color='red' variant='light' onClick={() => handleActionClick('delete', transaction.id)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Print Receipt' position='top' withArrow>
            <ActionIcon color='teal' variant='light' onClick={() => printReceipt(transaction)}>
              <IconPrinter size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      {/* Password Modal */}
      <Modal opened={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} title='Enter Password' centered>
        <TextInput label='Password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button variant='outline' onClick={() => setPasswordModalOpen(false)} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button onClick={validatePassword}>Submit</Button>
        </div>
      </Modal>

      <ScrollArea style={{ height: 'calc(100vh-100px)' }}>
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
    </>
  );
}

export default TransactionsTable;
