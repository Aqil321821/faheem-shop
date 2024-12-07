import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Box, Card, Button, Modal, Text } from '@mantine/core';
import TransactionForm from '../components/TransactionForm';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { fireDB } from '../firebase';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { getDocs, query, collection, orderBy, where } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTable';
import Filters from '../components/Filters';
import jsPDF from 'jspdf';
import { IconPlus, IconPrinter, IconTable, IconChartBar, IconExclamationCircle,  } from '@tabler/icons-react';

import 'jspdf-autotable';
import moment from 'moment';
import Analytics from '../components/Analytics';

function Home() {
  const [filters, setFilters] = useState({ type: '', frequency: 'today', dateRange: [] });
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [view, setView] = useState('table');

  const getWhereConditions = () => {
    const tempConditions = [];
    // Type condition
    if (filters.type !== '') {
      tempConditions.push(where('type', '==', filters.type));
    }
    if (filters.category && filters.category !== 'All') {
      tempConditions.push(where('category', '==', filters.category));
    }

    // Frequency condition
    if (filters.frequency !== 'custom-range') {
      if (filters.frequency === 'today') {
        // Filter transactions for today
        const today = moment().format('YYYY-MM-DD');
        tempConditions.push(where('date', '==', today));
      } else if (filters.frequency === '7') {
        tempConditions.push(where('date', '>=', moment().subtract(7, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '14') {
        tempConditions.push(where('date', '>=', moment().subtract(14, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '30') {
        tempConditions.push(where('date', '>=', moment().subtract(30, 'days').format('YYYY-MM-DD')));
      } else if (filters.frequency === '365') {
        tempConditions.push(where('date', '>=', moment().subtract(365, 'days').format('YYYY-MM-DD')));
      }
    } else {
      const fromDate = moment(filters.dateRange[0]).format('YYYY-MM-DD');
      const toDate = moment(filters.dateRange[1]).format('YYYY-MM-DD');
      tempConditions.push(where('date', '>=', fromDate));
      tempConditions.push(where('date', '<=', toDate));
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

    // Calculate grand totals and profit
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const profit = totalIncome - totalExpense;
    const totalTransactions = transactions.length;
    const incomeCount = transactions.filter((t) => t.type === 'income').length;
    const expenseCount = transactions.filter((t) => t.type === 'expense').length;

    // Format date range from filters
    let dateRangeText = '';
    if (filters.frequency === 'custom-range' && filters.dateRange.length === 2) {
      const fromDate = moment(filters.dateRange[0]).format('DD-MM-YYYY');
      const toDate = moment(filters.dateRange[1]).format('DD-MM-YYYY');
      dateRangeText = `Date Range: ${fromDate} to ${toDate}`;
    } else if (filters.frequency === 'today') {
      dateRangeText = `Showing Transactions for Today (${moment().format('DD-MM-YYYY')})`;
    } else {
      dateRangeText = `Showing Last ${filters.frequency} Days`;
    }

    // Add title and date range to the PDF
    doc.setFontSize(16);
    doc.text('Transaction Records', 14, 15);
    doc.setFontSize(12);
    doc.text(dateRangeText, 14, 25);

    // Add table of transactions
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Add summary section
    doc.setFontSize(12);
    doc.text(`Total Transactions: ${totalTransactions}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Income: Rs. ${totalIncome.toFixed(2)} (Count: ${incomeCount})`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Expense: Rs. ${totalExpense.toFixed(2)} (Count: ${expenseCount})`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Profit: Rs. ${profit.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 40);

    // Save the PDF
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
                style={{ width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => {
                  setShowForm(true);
                  setFormMode('add');
                }}>
                <IconPlus size={18} style={{ marginRight: '10px' }} /> {/* Icon for "Add Transaction" */}
                Add Transaction
              </Button>

              <Button color='blue' style={{ width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={printPDF}>
                <IconPrinter size={18} style={{ marginRight: '10px' }} /> {/* Icon for "Print Transactions" */}
                Print Transactions
              </Button>

              {/* Button for View */}

              <Button color='gray' style={{ width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setView(view === 'table' ? 'analytics' : 'table')}>
                {view === 'table' ? (
                  <>
                    <IconChartBar size={18} style={{ marginRight: '10px' }} />
                    Analytics View
                  </>
                ) : (
                  <>
                    <IconTable size={18} style={{ marginRight: '10px' }} />
                    Table View
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table Box */}
        <Card
          sx={{
            minHeight: '800px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          }}
          withBorder>
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh )',
            }}>
            {transactions.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginTop: '20px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}>
                <IconExclamationCircle size={48} color='red' style={{ marginBottom: '15px' }} />
                <Text
                  align='center'
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#666',
                    marginBottom: '10px',
                  }}>
                  No Data Found
                </Text>
                <Text
                  align='center'
                  style={{
                    fontSize: '16px',
                    color: '#888',
                    maxWidth: '400px',
                  }}>
                  There are no transactions matching your current filters. Please try adjusting your filters or adding a new transaction.
                </Text>
              </Box>
            ) : (
              <>
                {view === 'table' && (
                  <TransactionsTable
                    transactions={transactions} // Pass unfiltered transactions
                    setSelectedTransaction={setSelectedTransaction}
                    setFormMode={setFormMode}
                    setShowForm={setShowForm}
                    onTransactionAdded={getData}
                  />
                )}
                {/* //fahem put charts here ! */}
                {view === 'analytics' && <Analytics transactions={transactions} />}
                {/* {view === 'analytics' && <Fahem transactions={transactions} />} */}
              </>
            )}
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
