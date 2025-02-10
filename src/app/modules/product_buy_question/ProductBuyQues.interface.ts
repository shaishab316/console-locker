export type TProductBuyQues = {
  image: string;
  name: string;
  base_price: number;
  questions: TBuyQues[];
};

export type TBuyQues = {
  name: string;
  description: string;
  options: { option: string; price: number }[];
};
