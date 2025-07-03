import Ably from 'ably';

export default async function publishSubscribe(
  conversationId: string,
  message: any,
) {
  // Connect to Ably with your API key
  const ably = new Ably.Realtime(
    'JpheVQ.BlzHcQ:L-Q2TnuYlPd40UeXiDn7aaInl-OpKGwgotS4RJ98JW0',
  );

  ably.connection.once('connected', () => {
    console.log('Connected to Ably!');
  });

  // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
  const channel = ably.channels.get('get-started');

  const channel1 = ably.channels.get(`chat-67c91f621ecf8257596a4f18`);

  await channel1.subscribe('testing', (message) => {
    console.log('Message received: ' + message.data);
  });

  await channel.publish(conversationId, message);

  // Close the connection to Ably after a 5 second delay
  setTimeout(async () => {
    ably.connection.close();
    await ably.connection.once('closed', function () {
      console.log('Closed the connection to Ably.');
    });
  }, 5000);
}
