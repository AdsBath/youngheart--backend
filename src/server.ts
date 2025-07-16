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

  wss.on('connection', ws => {
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Listen for notifications and send them to the connected client
    notificationEmitter.on('orderCreated', order => {
      ws.send(
        JSON.stringify({
          type: 'orderCreated',
          message: `Your order #${order.id} has been created!`,
          orderId: order.id,
        }),
      );
    });
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
