export type TProductBuyQues = {
  image: string;
  name: string;
  base_price: number;
  questions: TBuyQues[];
  product_type: string;
  brand: string;
};

export type TBuyQues = {
  name: string;
  description: string;
  options: {
    option: string;
    description: string;
    price: number;
  }[];
};
