import notificationEmitter from '../events/notificationEmitter';

// Handling orderCreated event
notificationEmitter.on('orderCreated', order => {
  // Example: Send email notification
  sendEmailNotification(order.userId, 'Your order has been created!', order);

  // Example: Send real-time notification (WebSocket, Pusher, etc.)
  sendRealTimeNotification(order.userId, 'Your order has been created!');
});

const sendEmailNotification = async (
  userId: string,
  subject: string,
  order: any,
) => {
  // Implement email sending logic here
  console.log(`Email sent to user ${userId} with subject: ${subject}`);
  console.log(order, 'order');
};

const sendRealTimeNotification = (userId: string, message: string) => {
  // Implement real-time notification logic here (e.g., using WebSocket, Pusher)
  console.log(`Real-time notification sent to user ${userId}: ${message}`);
};
