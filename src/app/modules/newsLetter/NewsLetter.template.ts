import { TCustomer } from '../customer/Customer.interface';

export const NewsLetterTemplate = {
  unsubscribe: ({ name }: TCustomer) => /* html */ `<!doctype html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8" />
      <title>Console Locker - Unsubscribe</title>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen flex items-center justify-center m-0">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center shadow-xl">
        <img src="https://consolelocker.it/home/logo.png" alt="Console Locker Logo" class="mx-auto mb-4 invert grayscale-100">
        <h1 class="text-2xl md:text-3xl font-bold text-emerald-400 mb-4">
          Unsubscribed Successfully
        </h1>
        <p class="text-gray-300 text-base leading-relaxed mb-6">
          Hi ${name}, you've been successfully unsubscribed from the Console Locker Newsletter. 
          We're sorry to see you go. If you change your mind, you're always welcome back!
        </p>
        <a href="https://consolelocker.it" class="inline-block px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition">
          Visit Website
        </a>
        <p class="text-xs text-gray-500 mt-6">
          &copy; ${new Date().getFullYear()} Console Locker. All rights reserved.
        </p>
      </div>
    </body>
  </html>`,
};
