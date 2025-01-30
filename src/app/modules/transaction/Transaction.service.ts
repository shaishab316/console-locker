import { Request } from 'express';
import { TTransaction } from './Transaction.interface';
import { Transaction } from './Transaction.model';

export const TransactionService = {
  async createTransaction(transactionData: TTransaction) {
    const newTransaction = await Transaction.create(transactionData);

    return newTransaction;
  },

  async retrieveTransaction(req: Request) {
    const transactions = await Transaction.find();

    return transactions;
  },
};
