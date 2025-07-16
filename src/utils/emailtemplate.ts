const totalDiscount = (order: any) => {
  return order.reduce(
    (sum: any, item: any) =>
      sum + (item.price * item.quantity * item.discount) / 100,
    0,
  );
};
const totalAmount = (order: any) => {
  return order.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0,
  );
};
const totalPayable = (order: any, shippingCharge: any) => {
  return (
    order.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0) -
    totalDiscount(order) +
    shippingCharge
  );
};
export const emailTemplate = (
  order: any,
  getOrder: any,
  firstName: string,
  lastName: string,
) => `
  <!DOCTYPE html>
  <html>
   <style>
body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        font-size:16px
      }
      .email-container {
        background-color: #ffffff;
        margin: 30px auto;
        border-radius: 8px;
        overflow: hidden;
        padding: 20px;
        box-shadow: 0px 1px 25px rgba(0, 0, 0, 0.15);
      }
      .header {
        background-color: #4caf50;
        color: white;
        padding: 10px;
        text-align: center;
        border-radius: 4px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        color: #333;
      }
      .content p {
        margin: 5px 0;
      }
      .order-details {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
      }
      .order-details th,
      .order-details td {
        padding: 5px 10px;
        text-align: left;
        border: .5px solid #dddddd;
      }
      .order-details th {
        background-color: #f4f4f4;
      }
      .summary {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 16px;
        color: #555;
        border-radius: 0 0 8px 8px;
      }
      .footer a {
        color: #3498db;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }

   </style>
    <body>
    <div class="email-container">
      <div class="content" style="font-size: 16px">
        <p>Dear ${firstName + ' ' + lastName},</p>
        <p style="font-size: 16px">
          Thank you for choosing <strong>Babukhusi</strong> for your order! Your delivery will soon arrive at the address you provided. Below are the details of your order:
        </p>

        <p style="font-size: 16px"><strong>Order ID:</strong> ${order.orderId}</p>
        <p style="font-size: 16px">
          <strong>Order Date:</strong> ${new Date(
            order.createdAt,
          ).toLocaleDateString()}
        </p>

      <h2>Your Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Sl No</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Product ID</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Per Unit Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Discount</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Discount Amount</th>
          </tr>
        </thead>
        <tbody>
          ${getOrder.orderItems

            .map(
              (item: any, index: number) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.productSku}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.quantity
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">৳${
                item.price
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.discount
              }%</td>
              <td style="border: 1px solid #ddd; padding: 8px;">৳${
                (item.price * item.quantity * item.discount) / 100
              }</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
        <tr>
                      <td style="padding: 8px;">
               </td>
            </tr>
        <span style="display: block; paddingTop: 16px; paddingBottom: 16px"></span>
        <tfoot style="mnarginTop: 24px">
          <tr>
            <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Amount</td>
            <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">৳${totalAmount(getOrder.orderItems)}</td>
          </tr>
          <tr>
            <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Discount Amount</td>
            <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">৳${totalDiscount(getOrder.orderItems)}</td>
          </tr>
          <tr>
            <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Shipping Charge</td>
            <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">৳${order.shippingCharge}</td>
          </tr>
          <tr>
            <td colspan="6" style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Total Payable Amount</td>
            <td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">৳${totalPayable(getOrder.orderItems, order.shippingCharge)}</td>
          </tr>
        </tfoot>
      </table>
      <hr/>
       <div class="footer">
        
          <div style=" text-align: left; margin-top: 20px">
          <p style="font-size: 16px; margin-bottom: 0px">Thank you for being a valued customer, and we look forward to serving you again! Best regards,</p>
          <h5 style="font-size: 16px; margin-top: 0px; font-weight: bold">The Babukhusi Team</h5>
          </div>
      </div>
    </div>

    <p style="margin-top: 20px; font-size: 16px; margin-bottom: 20px">If you have any further questions or need assistance, please feel free to reach out to us-</p>

    <div
      style="
        text-align: center;
        font-family: Arial, sans-serif;
      "
    >
            <strong style="font-size: 18px; margin-bottom: 8px">Babukhusi</strong>
      <p style="font-size: 16px">Extensive Collection Exceptional Care</p>
    
      

      <!-- Contact Info -->
      <p style="font-size: 16px">
       <a
          href="https://www.babukhusi.com/offer"
          style="color: #3498db; text-decoration: none"
          > Exclusive Offer</a
        > Web_
        <a
          href="https://www.babukhusi.com"
          style="color: #3498db; text-decoration: none"
          >www.babukhusi.com,</a
        >
         Cell: +8801889175408<br />
      </p>

    </div>
    </body>
  </html>
`;
