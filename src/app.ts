import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import sendResponse from './shared/sendResponse';

const app: Application = express();

const allowedOrigins = ['https://youngheartbd.com', 'http://localhost:3000'];

app.use(
  cors({
    origin: (
      origin: string | undefined, // origin can be a string or undefined (when there is no origin header)
      // eslint-disable-next-line no-unused-vars
      callback: (error: Error | null, allow: boolean) => void, // type the callback correctly
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true); // Allow request
      }
      // Reject requests from disallowed origins
      return callback(new Error('Not allowed by CORS'), false); // Reject request
    },
    methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you want to include cookies in CORS requests
  }),
);

// No need for manual preflight handling since `cors` middleware does this

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//default route
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Yap Our Babu khusi server is running! 🚀',
  });
});

app.use('/api/v1', routes);

// const shippingCharge = 5;
// const totalDiscount = orderDetails.reduce(
//   (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
//   0,
// );
// const totalAmount = orderDetails.reduce(
//   (sum, item) => sum + item.price * item.quantity,
//   0,
// );
// const totalPayable =
//   orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0) -
//   totalDiscount +
//   shippingCharge;

// const htmlContent = `
//   <!DOCTYPE html>
//   <html>
//    <style>
// body {
//         font-family: Arial, sans-serif;
//         background-color: #f9f9f9;
//         margin: 0;
//         padding: 0;
//         font-size:16px
//       }
//       .email-container {
//         background-color: #ffffff;
//         margin: 30px auto;
//         border-radius: 8px;
//         overflow: hidden;
//         padding: 20px;
//         box-shadow: 0px 1px 25px rgba(0, 0, 0, 0.15);
//       }
//       .header {
//         background-color: #4caf50;
//         color: white;
//         padding: 10px;
//         text-align: center;
//         border-radius: 4px;
//       }
//       .header h1 {
//         margin: 0;
//         font-size: 24px;
//       }
//       .content {
//         padding: 20px;
//         font-size: 16px;
//         color: #333;
//       }
//       .content p {
//         margin: 5px 0;
//       }
//       .order-details {
//         width: 100%;
//         border-collapse: collapse;
//         margin: 10px 0;
//       }
//       .order-details th,
//       .order-details td {
//         padding: 5px 10px;
//         text-align: left;
//         border: .5px solid #dddddd;
//       }
//       .order-details th {
//         background-color: #f4f4f4;
//       }
//       .summary {
//         margin-top: 20px;
//         font-size: 16px;
//         color: #333;
//       }
//       .footer {
//         text-align: center;
//         padding: 10px;
//         font-size: 16px;
//         color: #555;
//         border-radius: 0 0 8px 8px;
//       }
//       .footer a {
//         color: #3498db;
//         text-decoration: none;
//       }
//       .footer a:hover {
//         text-decoration: underline;
//       }

//    </style>
//     <body>
//     <div class="email-container">

//         <p style="font-size: 16px"><strong>Subject:</strong> Thank You for Your Order!</p>

//       <div class="content" style="font-size: 16px">
//         <p>Dear ${'Omar' + ' ' + 'Faruk'},</p>
//         <p style="font-size: 16px">
//           Thank you for choosing <strong>Babukhusi</strong> for your order! Your delivery will soon arrive at the address you provided. Below are the details of your order:
//         </p>

//         <p style="font-size: 16px"><strong>Order ID:</strong> ${'#123'}</p>
//         <p style="font-size: 16px">
//           <strong>Order Date:</strong> ${new Date().toLocaleDateString()}
//         </p>

//       <h2>Your Order Summary</h2>
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
//         <thead>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px;">Sl No</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Product ID</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Per Unit Price</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Discount</th>
//             <th style="border: 1px solid #ddd; padding: 8px;">Discount Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${orderDetails
//             .map(
//               (item, index) => `
//             <tr>
//               <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${item.id}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${
//                 item.quantity
//               }</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">$${
//                 item.price
//               }</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${
//                 item.discount
//               }%</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">$${
//                 (item.price * item.quantity * item.discount) / 100
//               }</td>
//             </tr>
//           `,
//             )
//             .join('')}
//         </tbody>
//         <tr>
//                       <td style="padding: 8px;">
//                </td>
//             </tr>
//         <span style="display: block; paddingTop: 16px; paddingBottom: 16px"></span>
//         <tfoot style="mnarginTop: 24px">
//           <tr>
//             <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Amount</td>
//             <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">$${totalAmount}</td>
//           </tr>
//           <tr>
//             <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Discount Amount</td>
//             <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">$${totalDiscount}</td>
//           </tr>
//           <tr>
//             <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Shipping Charge</td>
//             <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">$${shippingCharge}</td>
//           </tr>
//           <tr>
//             <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Payable Amount</td>
//             <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">$${totalPayable}</td>
//           </tr>
//         </tfoot>
//       </table>
//       <hr/>
//        <div class="footer">

//           <div style=" text-align: left; margin-top: 20px">
//           <p style="font-size: 16px; margin-bottom: 0px">Thank you for being a valued customer, and we look forward to serving you again! Best regards,</p>
//           <h5 style="font-size: 16px; margin-top: 0px; font-weight: bold">The Babukhusi Team</h5>
//           </div>
//       </div>
//     </div>

//     <p style="margin-top: 20px; font-size: 16px; margin-bottom: 20px">If you have any further questions or need assistance, please feel free to reach out to us-</p>

//     <div
//       style="
//         text-align: center;
//         font-family: Arial, sans-serif;
//       "
//     >
//             <strong style="font-size: 18px; margin-bottom: 8px">Babukhusi</strong>
//       <p style="font-size: 16px">Extensive Collection Exceptional Care</p>

//       <!-- Contact Info -->
//       <p style="font-size: 16px">
//        Exclusive Offer- ( Offer Section) Web_
//         <a
//           href="https://babukhushi.com"
//           style="color: #3498db; text-decoration: none"
//           >www.babukhusi.com,</a
//         >
//          Cell: +8801234567890<br />
//       </p>

//     </div>
//     </body>
//   </html>
// `;

// app.get('/send-email', (req: Request, res: Response) => {
//   sendEmail('omarfarukkhan647@gmail.com', 'test mail', htmlContent);
//   res.send('Email sent successfully!');
// });
//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
