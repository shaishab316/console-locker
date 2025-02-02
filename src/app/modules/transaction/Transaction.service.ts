import { TTransaction } from './Transaction.interface';
import { Transaction } from './Transaction.model';

export const TransactionService = {
  async createTransaction(transactionData: TTransaction) {
    const newTransaction = await Transaction.create(transactionData);

    return newTransaction;
  },

  async retrieveTransaction({ page = 1, limit = 10 }: Record<string, any>) {
    const pipeline: any[] = [
      {
        $facet: {
          paginatedResults: [
            { $sort: { createdAt: -1 } },
            { $skip: (+page - 1) * +limit },
            { $limit: +limit },
          ],
          totalCount: [{ $count: 'count' }],
          totalBuy: [
            { $match: { type: 'buy' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ],
          totalSell: [
            { $match: { type: 'sell' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ],
          yearlyEarnings: [
            {
              $group: {
                _id: { $month: '$createdAt' },
                totalBuy: {
                  $sum: { $cond: [{ $eq: ['$type', 'buy'] }, '$amount', 0] },
                },
                totalSell: {
                  $sum: { $cond: [{ $eq: ['$type', 'sell'] }, '$amount', 0] },
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    const transactions = result[0]?.paginatedResults || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    const totalBuy = result[0]?.totalBuy[0]?.total || 0;
    const totalSell = result[0]?.totalSell[0]?.total || 0;
    const totalEarnings = totalSell - totalBuy;

    // List of months
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Map earnings to months
    const yearlyEarnings = months.map((month, index) => {
      const data = result[0]?.yearlyEarnings.find(
        (e: any) => e._id === index + 1,
      ) || {
        totalBuy: 0,
        totalSell: 0,
      };
      const totalEarningsForMonth = data.totalSell - data.totalBuy;
      return {
        month,
        totalBuy: data.totalBuy.toFixed(2),
        totalSell: data.totalSell.toFixed(2),
        totalEarnings: totalEarningsForMonth.toFixed(2),
      };
    });

    return {
      meta: {
        totalPages: Math.ceil(totalCount / +limit),
        page: +page,
        limit: +limit,
        total: totalCount,
        totalBuy: totalBuy.toFixed(2),
        totalSell: totalSell.toFixed(2),
        totalEarnings: totalEarnings.toFixed(2),
      },
      transactions,
      yearlyEarnings,
    };
  },
};
