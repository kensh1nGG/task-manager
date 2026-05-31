import amqplib from 'amqplib';

let channel = null;
let connection = null;

// Подключение к RabbitMQ
export async function connectRabbitMQ() {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqplib.connect(rabbitMQUrl);
    channel = await connection.createChannel();
    
    // Настраиваем Dead Letter Exchange
    await channel.assertExchange('dlx_exchange', 'direct', { durable: true });
    
    // Настраиваем Dead Letter Queue
    await channel.assertQueue('dead_letter_queue', { durable: true });
    await channel.bindQueue('dead_letter_queue', 'dlx_exchange', 'dead');
    
    // Настраиваем основную очередь задач с DLQ
    await channel.assertQueue('task_queue', { 
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx_exchange',
        'x-dead-letter-routing-key': 'dead',
      }
    });
    
    console.log('✅ RabbitMQ подключен и очереди настроены');
    return channel;
  } catch (error) {
    console.warn('⚠️  RabbitMQ недоступен, работа без очереди сообщений');
    console.warn('Ошибка:', error.message);
    return null;
  }
}

// Получение канала
export function getChannel() {
  return channel;
}

// Отправка сообщения в очередь
export async function sendToQueue(queueName, data) {
  if (!channel) {
    console.log('📝 Задача обработана синхронно:', data);
    return;
  }
  
  const message = JSON.stringify(data);
  channel.sendToQueue(queueName, Buffer.from(message), { 
    persistent: true 
  });
  console.log(`[Producer] Отправлено в ${queueName}:`, data);
}

// Закрытие соединения
export async function closeRabbitMQ() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}