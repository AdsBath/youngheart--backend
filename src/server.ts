import { Server } from 'http';
// import { errorLogger, logger } from './shared/logger';
import WebSocket from 'ws';
import './app/listeners/notificationLiseners'; // Import the listener

import app from './app';
import config from './config';
import notificationEmitter from './app/events/notificationEmitter';

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.log(
      `👽 Server running on port 🔦 ${config.port}` + ' 🚀 ' + config.env,
    );
  });

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log(
      'Client connected to WebSocket from:',
      req.socket.remoteAddress,
    );

    // Send a test message to confirm connection
    ws.send(
      JSON.stringify({
        type: 'connectionTest',
        message: 'WebSocket connection established successfully!',
        timestamp: new Date().toISOString(),
      }),
    );

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', error => {
      console.error('WebSocket error:', error);
    });

    // Listen for notifications and send them to the connected client
    notificationEmitter.on('orderCreated', order => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'orderCreated',
            message: `Your order #${order.id} has been created!`,
            orderId: order.id,
          }),
        );
      }
    });
  });

  wss.on('error', error => {
    console.error('WebSocket server error:', error);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed 🔒');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    // errorLogger.error(error);
    console.error(error);

    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    // logger.info('SIGTERM received');
    console.log('SIGTERM received');

    if (server) {
      server.close();
    }
  });
}

bootstrap();
