import config from '../../../config';

export const OrderTemplate = {
  base({ receipt, customer, productDetails, amount }: any, statusText: string) {
    return /*html*/ `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Console Locker - Order Confirmation</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
          <style>
            body{
              font-family: "Poppins", sans-serif;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; overflow: hidden; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
                    <!-- Brand Header -->
                    <tr>
                      <td align="center" style="padding: 32px 0;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #4f46e5; font-size: 24px; font-weight: bold;">
                              <img src="${config.href}/images/logo.png" alt="Console Locker" style="max-width: 300px;">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
          
                    <!-- Order Header -->
                    <tr>
                      <td style="padding: 0 32px 24px; border-bottom: 1px solid #e5e7eb;">
                        <h3 style="margin:0;">Hi, ${customer.name}</h3>
                        <h1 style="margin: 0;color: #1f2937; font-size: 24px;">${statusText}</h1>
                        <p style="margin: 0;">Receipt: <span style="color:rgb(238, 40, 40); font-weight: 700; font-size: 17px; letter-spacing: 1px;">#${receipt}</span></p>
                      </td>
                    </tr>
          
                    <!-- Products -->
                    ${productDetails
                      .map(
                        ({ product, price, quantity }: any) => /*html*/ `
                      <tr>
                        <td style="padding: 24px 32px; border-bottom: 1px solid #e5e7eb;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                <a href="${config.url.ui}/buy/${product.slug}" style="text-decoration: none; color: black;" target="_blank">
                                  <h3 style="margin: 0 0 8px; color: #1f2937; font-size: 16px;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td><span>${product.name}</span></td>
                                        <td align="right"><span>$${(price! * quantity!).toFixed(2)}</span></td>
                                      </tr>
                                    </table>
                                  </h3>
                                  <p style="margin: 0; color: #6b7280;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td><span>Quantity: ${quantity}</span></td>
                                        <td align="right"><span>$${price} each</span></td>
                                      </tr>
                                    </table>
                                  </p>
                                  <p style="margin: 5px 0; font-size: 12px;">
                                    Model: <span style="color: blue;">${product.model}</span>,
                                    Controller: <span style="color: green;">${product.controller}</span>,
                                    Condition: <span style="color: orange;">${product.condition}</span>,
                                    Memory: <span style="color: purple;">${product.memory}</span>
                                  </p>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    `,
                      )
                      .join('')}
                    
                    <!-- Total -->
                    <tr>
                      <td style="padding: 24px 32px; border-top: 1px solid #e5e7eb;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="color: #1f2937; font-size: 18px; font-weight: bold;">Total Amount:</td>
                            <td align="right" style="color: #1f2937; font-size: 24px; font-weight: bold;">$${amount}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Thank you for shopping with Console Locker!</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">For any questions, contact our support team at support@consolelocker.com</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
  },

  receipt(order: any) {
    return this.base(order, 'Order Confirmation');
  },

  success(order: any) {
    return this.base(order, 'Products Shipped');
  },
};
