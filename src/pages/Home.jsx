import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Box, Card, Button, Modal } from '@mantine/core';
import TransactionForm from '../components/TransactionForm';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { fireDB } from '../firebase';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { getDocs, query, collection, orderBy, where } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTable';
import Filters from '../components/Filters';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

function Home() {
  const [filters, setFilters] = useState({ type: '', frequency: '7', fromDate: '', toDate: '' });
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState({});

  const getWhereConditions = () => {
    const tempConditions = [];
    // Type condition
    if (filters.type !== '') {
      tempConditions.push(where('type', '==', filters.type));
    }
    // Frequency condition
    if (filters.frequency !== 'custom-range') {
      if (filters.frequency === '7') {
        tempConditions.push(where('date', '>=', moment().subtract(7, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '14') {
        tempConditions.push(where('date', '>=', moment().subtract(14, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '30') {
        tempConditions.push(where('date', '>=', moment().subtract(30, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '365') {
        tempConditions.push(where('date', '>=', moment().subtract(365, 'days').format('YYYY-MM-DD')));
      }
    }
    return tempConditions;
  };

  const getData = async () => {
    try {
      const whereConditions = getWhereConditions();
      dispatch(ShowLoading());
      const qry = query(collection(fireDB, `users/${user.id}/transactions`), orderBy('time', 'desc'), ...whereConditions);
      const response = await getDocs(qry);

      const newTransactions = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(newTransactions);

      dispatch(HideLoading());
    } catch (error) {
      console.error(error);
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
  }, [filters]);

  return (
    <>
      <Box m={5} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '0px' }}>
        <Header />

        {/* Filters Box */}
        <Card
          sx={{
            minHeight: '150px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '20px',
          }}
          withBorder
          mt={20}>
          <div className='flex justify-between'>
            <Filters filters={filters} setFilters={setFilters} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Button
                color='green'
                style={{ width: '200px' }}
                onClick={() => {
                  setShowForm(true);
                  setFormMode('add');
                }}>
                Add Transaction
              </Button>
              <Button color='blue' style={{ width: '200px' }} onClick={printPDF}>
                Print Transactions
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table Box */}
        <Card
          sx={{
            minHeight: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          }}
          withBorder>
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 300px)',
            }}>
            <TransactionsTable
              transactions={transactions} // Pass unfiltered transactions
              setSelectedTransaction={setSelectedTransaction}
              setFormMode={setFormMode}
              setShowForm={setShowForm}
            />
          </Box>
        </Card>

        {/* Modal for Transaction Form */}
        <Modal size='lg' opened={showForm} onClose={() => setShowForm(false)} title={formMode === 'add' ? 'Add Transaction' : 'Edit Transaction'} centered>
          <TransactionForm onTransactionAdded={getData} transactionData={selectedTransaction} formMode={formMode} setFormMode={setFormMode} setShowForm={setShowForm} showForm={showForm} />
        </Modal>
      </Box>
    </>
  );
}

export default Home;
