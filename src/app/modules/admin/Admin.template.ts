export const sendOtpTemplate = (userName: string, otp: number) => /*html*/ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Console Locker - OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .email-container {
          max-width: 400px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
          border: 2px solid #2d89ef;
        }
        .email-container h1 {
          font-size: 20px;
          color: #2d89ef;
          margin-bottom: 10px;
        }
        .email-container p {
          color: #555;
          font-size: 16px;
          margin: 10px 0;
        }
        .otp {
          font-size: 28px;
          font-weight: bold;
          color: #2d89ef;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Console Locker</h1>
        <p>Hi ${userName}. Your OTP for verification is:</p>
        <p class="otp">${otp}</p>
        <p>
          This OTP is valid for <strong>2 minutes</strong>. Please use it before
          it expires.
        </p>
        <p>If you didn’t request this, please ignore this email.</p>
        <div class="footer">&copy; 2025 Console Locker</div>
      </div>
    </body>
  </html>
`;
