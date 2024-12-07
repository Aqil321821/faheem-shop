import { Divider, Group } from '@mantine/core';
import React from 'react';
import '../stylesheets/analytics.css';
import { RingProgress, Text } from '@mantine/core';
import { Progress } from '@mantine/core';

function Analytics({ transactions }) {
  const totalTransactions = transactions.length;

  // transactions count
  const totalIncomeTransactions = transactions.filter((transaction) => transaction.type === 'income').length;
  const totalExpenseTransactions = transactions.filter((transaction) => transaction.type === 'expense').length;
  const totalIncomeTransactionsPercentage = (totalIncomeTransactions / totalTransactions) * 100;
  const totalExpenseTransactionsPercentage = (totalExpenseTransactions / totalTransactions) * 100;

  // total amount
  const totalAmount = transactions.reduce((acc, transaction) => {
    return acc + Number(transaction.amount);
  }, 0);
  const totalIncomeAmount = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
  const totalExpenseAmount = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((acc, transaction) => {
      return acc + Number(transaction.amount);
    }, 0);
  const totalIncomeAmountPercentage = (totalIncomeAmount / totalAmount) * 100;
  const totalExpenseAmountPercentage = (totalExpenseAmount / totalAmount) * 100;

  const categories = [
    { label: 'Repairing', value: 'repairing' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Mobile Sale', value: 'mobile-sale' },
    { label: 'Other', value: 'other' },
  ];
  const expenseCategories = [
    { label: 'Repairing things', value: 'repairing' },
    { label: 'Mobile Purchase', value: 'mobile-purchase' },
    { label: 'Rent', value: 'rent' },
    { label: 'Salary', value: 'salary' },
    { label: 'Bills', value: 'bill' },
    { label: 'Food', value: 'food' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <div className='aqil-rao'>
      <div className='aqil-ring'>
        <div className='total-transactions'>
          <h1 className='card-title'>Total Transactions : {totalTransactions}</h1>
          <Divider my={20} />
          <p>Income Transactions : {totalIncomeTransactions}</p>
          <p>Expense Transactions : {totalExpenseTransactions}</p>

          <Group>
            <RingProgress
              label={
                <Text size='xs' align='center'>
                  Income {totalIncomeTransactionsPercentage.toFixed(2)}%
                </Text>
              }
              roundCaps
              sections={[
                {
                  value: 100 - totalIncomeTransactionsPercentage,
                },
                { value: totalIncomeTransactionsPercentage, color: 'teal' },
              ]}
            />

            <RingProgress
              label={
                <Text size='xs' align='center'>
                  Expense {totalExpenseTransactionsPercentage.toFixed(2)}%
                </Text>
              }
              roundCaps
              sections={[
                {
                  value: 100 - totalExpenseTransactionsPercentage,
                },
                { value: totalExpenseTransactionsPercentage, color: 'red' },
              ]}
            />
          </Group>
        </div>

        <div className='total-turnover'>
          <h1 className='card-title'>Total Turnover : {totalAmount}</h1>
          <Divider my={20} />
          <p>Income : {totalIncomeAmount}</p>
          <p>Expense : {totalExpenseAmount}</p>

          <Group>
            <RingProgress
              label={
                <Text size='xs' align='center'>
                  Income {totalIncomeAmountPercentage.toFixed(2)}%
                </Text>
              }
              roundCaps
              sections={[
                {
                  value: 100 - totalExpenseAmountPercentage,
                },
                { value: totalIncomeAmountPercentage, color: 'green' },
              ]}
            />

            <RingProgress
              label={
                <Text size='xs' align='center'>
                  Expense {totalExpenseAmountPercentage.toFixed(2)}%
                </Text>
              }
              roundCaps
              sections={[
                {
                  value: 100 - totalExpenseAmountPercentage,
                },
                { value: totalExpenseAmountPercentage, color: 'red' },
              ]}
            />
          </Group>
        </div>
      </div>

      {/* Progrees wala 2 div */}
      <div className='aqil-pro'>
        {/* income-progress */}
        <div className='income-categories'>
          <h1 className='card-title'>Income Categories</h1>
          <Divider my={20} />
          {categories.map((category) => {
            const incomeCategoryTransactionsAmount = transactions
              .filter((transaction) => transaction.type === 'income' && transaction.category === category.value)
              .reduce((acc, transaction) => {
                return acc + Number(transaction.amount);
              }, 0);
            const incomeCategoryTransactionsPercentage = (incomeCategoryTransactionsAmount / totalIncomeAmount) * 100;
            return (
              <div key={category.index}>
                <p>{category.label}</p>
                <Progress size={25} color='teal' value={incomeCategoryTransactionsPercentage} label={incomeCategoryTransactionsPercentage.toFixed(2) + '%'} />
              </div>
            );
          })}
        </div>
        {/* expense progress */}
        <div className='expence-categories'>
          <h1 className='card-title'>Expence Categories</h1>
          <Divider my={20} />
          {expenseCategories.map((category) => {
            const expenceCategoryTransactionsAmount = transactions
              .filter((transaction) => transaction.type === 'expense' && transaction.category === category.value)
              .reduce((acc, transaction) => {
                return acc + Number(transaction.amount);
              }, 0);
            const expenceCategoryTransactionsPercentage = totalExpenseAmount ? (expenceCategoryTransactionsAmount / totalExpenseAmount) * 100 : 0;

            return (
              <div key={category.index}>
                <p>{category.label}</p>
                <Progress size={25} color='red' value={expenceCategoryTransactionsPercentage} label={`${expenceCategoryTransactionsPercentage.toFixed(2)}%`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
