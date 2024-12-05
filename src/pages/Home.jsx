import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Box, Card, Button, Modal } from '@mantine/core';
import TransactionForm from '../components/TransactionForm';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { fireDB } from '../firebase';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { getDocs, query, collection, orderBy } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

function Home() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState({});

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const qry = query(collection(fireDB, `users/${user.id}/transactions`), orderBy('time', 'desc'));
      const response = await getDocs(qry);

      const newTransactions = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(newTransactions);

      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      showNotification({
        title: 'Error occurred in fetching Transactions data',
        color: 'red',
      });
      dispatch(HideLoading());
    }
  };

  const printPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Name', 'Type', 'Amount', 'Date', 'Category', 'Reference', 'Description'];

    const tableRows = transactions.map((transaction) => {
      const amount = parseFloat(transaction.amount);
      const formattedAmount = isNaN(amount) ? 'Rs. 0.00' : 'Rs. ' + amount.toFixed(2);

      // Format date to DD-MM-YYYY
      const formattedDate = moment(transaction.date).format('DD-MM-YYYY');

      return [
        transaction.name,
        transaction.type,
        formattedAmount, // Correctly formatted amount with Rs.
        formattedDate, // Correctly formatted date
        transaction.category,
        transaction.reference || '-',
        transaction.description || '-',
      ];
    });

    doc.text('Transaction Records', 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Transactions.pdf');
  };

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter transactions based on today's date
  const filteredTransactions = transactions.filter((transaction) => moment(transaction.date).isSame(moment(), 'day'));

  const handleNewTransaction = () => {
    getData(); // Fetch data again to show updated transactions
  };

  return (
    <Box m={10} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '0px' }}>
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
        <div className='flex justify-between  '>
          <div>Filter</div>

          {/* Buttons Container */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }} className='aqil'>
            <Button
              color='green'
              onClick={() => {
                setShowForm(true);
                setFormMode('add');
              }}>
              Add Transaction
            </Button>
            <Button color='blue' onClick={printPDF}>
              Print Transactions
            </Button>
          </div>
        </div>

        <TransactionsTable transactions={filteredTransactions} setSelectedTransaction={setSelectedTransaction} setFormMode={setFormMode} setShowForm={setShowForm} />
      </Card>

      <Modal size='lg' opened={showForm} onClose={() => setShowForm(false)} title={formMode === 'add' ? 'Add Transaction' : 'Edit Transaction'} centered>
        <TransactionForm onTransactionAdded={handleNewTransaction} transactionData={selectedTransaction} formMode={formMode} setFormMode={setFormMode} setShowForm={setShowForm} showForm={showForm} />
      </Modal>
    </Box>
  );
}

export default Home;
