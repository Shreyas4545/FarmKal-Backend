import { Injectable, OnModuleInit } from '@nestjs/common';
import Ably from 'ably';
import { TransactionsService } from '../service/transactions/transactions.service';

@Injectable()
export class AblyServiceMaps implements OnModuleInit {
  constructor(private readonly transactionService: TransactionsService) {}

  onModuleInit() {
    const ably = new Ably.Realtime(
      'JpheVQ.BlzHcQ:L-Q2TnuYlPd40UeXiDn7aaInl-OpKGwgotS4RJ98JW0',
    );

    ably.connection.once('connected', () => {
      console.log('Connected to Ably!');
    });

    let ownerId: string = '';
    let customerId: string = '';
    let messageToPublish: any = {};

    const channel = ably.channels.get(`get-started`);

    channel.subscribe('testing', async (message) => {
      // console.log('Message received: ' + message.data);
      messageToPublish = message.data;
      ownerId = message.data.ownerId;
      customerId = message.data.customerId;

      await this.transactionService.addDriverLocation(message.data);
    });

    channel.publish(ownerId, messageToPublish);
    channel.publish(customerId, messageToPublish);
  }
}
