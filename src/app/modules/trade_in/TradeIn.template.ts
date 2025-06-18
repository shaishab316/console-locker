export const TradeInTemplate = {
  thanks: ({ cName = '', note = '', pName = '' }) => /* html */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thank You - Console Locker</title>
        <style>
          /* Reset styles */
          body,
          table,
          td,
          p,
          a,
          li,
          blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
          }
        
          /* Client-specific styles */
          .ReadMsgBody {
            width: 100%;
          }
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
        
          /* Mobile styles */
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              max-width: 100% !important;
            }
            .content {
              padding: 20px !important;
            }
            .header {
              padding: 20px !important;
            }
            .footer {
              padding: 20px !important;
            }
          }
        </style>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        "
      >
        <table
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          width="100%"
          style="background-color: #f4f4f4"
        >
          <tr>
            <td align="center" style="padding: 20px 0">
              <!-- Main Container -->
              <table
                class="container"
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                width="600"
                style="
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    class="header"
                    style="
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      padding: 30px;
                      text-align: center;
                      border-radius: 8px 8px 0 0;
                    "
                  >
                    <h1
                      style="
                        color: #ffffff;
                        margin: 0;
                        font-size: 28px;
                        font-weight: bold;
                        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                      "
                    >
                      Console Locker
                    </h1>
                    <p
                      style="
                        color: #ffffff;
                        margin: 5px 0 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                      "
                    >
                      consolelocker.it
                    </p>
                  </td>
                </tr>
        
                <!-- Content -->
                <tr>
                  <td class="content" style="padding: 40px 30px">
                    <!-- Thank You Message -->
                    <p
                      style="
                        color: #666666;
                        margin: 0 0 20px 0;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Dear ${cName},
                    </p>
        
                    <p
                      style="
                        color: #666666;
                        margin: 0 0 20px 0;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      We have successfully received '${pName}' sell request. Thank
                      you for choosing Console Locker as your trusted platform for
                      gaming console transactions.
                    </p>
        
                    <!-- Request Details Box -->
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      width="100%"
                      style="
                        background-color: #f8f9fa;
                        border-radius: 6px;
                        margin: 25px 0;
                      "
                    >
                      <tr>
                        <td style="padding: 20px">
                          <h3
                            style="
                              color: #333333;
                              margin: 0 0 15px 0;
                              font-size: 18px;
                              font-weight: bold;
                            "
                          >
                            📋 What Happens Next?
                          </h3>
                          ${note}
                        </td>
                      </tr>
                    </table>
        
                    <p
                      style="
                        color: #666666;
                        margin: 0 0 25px 0;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      If you have any questions or need immediate assistance, please
                      don't hesitate to contact our support team.
                    </p>
        
                    <!-- CTA Button -->
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="margin: 25px 0"
                    >
                      <tr>
                        <td style="text-align: center">
                          <a
                            href="https://consolelocker.it/contact"
                            style="
                              background: linear-gradient(
                                135deg,
                                #667eea 0%,
                                #764ba2 100%
                              );
                              color: #ffffff;
                              text-decoration: none;
                              padding: 12px 30px;
                              border-radius: 25px;
                              font-weight: bold;
                              font-size: 16px;
                              display: inline-block;
                              box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
                            "
                          >
                            Contact Support
                          </a>
                        </td>
                      </tr>
                    </table>
        
                    <p
                      style="
                        color: #666666;
                        margin: 25px 0 0 0;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Best regards,<br />
                      <strong style="color: #333333"
                        >The Console Locker Team</strong
                      >
                    </p>
                  </td>
                </tr>
        
                <!-- Footer -->
                <tr>
                  <td
                    class="footer"
                    style="
                      background-color: #f8f9fa;
                      padding: 25px 30px;
                      text-align: center;
                      border-radius: 0 0 8px 8px;
                      border-top: 1px solid #e9ecef;
                    "
                  >
                    <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px">
                      <strong>Console Locker</strong> - Your Trusted Gaming Console
                      Marketplace
                    </p>
                    <p style="color: #999999; margin: 0 0 15px 0; font-size: 12px">
                      Visit us at:
                      <a
                        href="https://consolelocker.it"
                        style="color: #667eea; text-decoration: none"
                        >consolelocker.it</a
                      >
                    </p>
        
                    <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 11px">
                      © ${new Date().getFullYear()} Console Locker. All rights
                      reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`,
};
