import { TTransaction } from './Transaction.interface';
import { Transaction } from './Transaction.model';

export const TransactionService = {
  async createTransaction(transactionData: TTransaction) {
    const newTransaction = await Transaction.create(transactionData);

    return newTransaction;
  },

  async retrieveTransaction({ page = 1, limit = 10 }: Record<any, any>) {
    const transactions = await Transaction.find()
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const totalCount = await Transaction.countDocuments();

    return {
      meta: {
        totalPages: Math.ceil(totalCount / +limit),
        page: +page,
        limit: +limit,
        total: totalCount,
      },
      transactions,
    };
  },
};
