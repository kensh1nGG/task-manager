import { getChannel } from '../config/rabbitmq.js';

const MAX_RETRIES = 3;

// Обработка задачи (имитация длительной операции)
async function processTask(task) {
  console.log(`[Worker] Начало обработки задачи: ${task.id} - ${task.title}`);
  
  // Имитация длительной операции (отправка email, генерация отчёта и т.д.)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Имитация возможной ошибки (30% шанс)
  if (Math.random() < 0.3) {
    throw new Error('Временная ошибка обработки');
  }
  
  console.log(`[Worker] Задача выполнена: ${task.id}`);
  return true;
}

// Экспоненциальная задержка с джиттером
function getExponentialDelay(attempt) {
  const baseDelay = 1000;
  const maxDelay = 30000;
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 1000;
  return exponentialDelay + jitter;
}

// Обработка сообщения с повторными попытками
async function processWithRetry(msg, channel) {
  const task = JSON.parse(msg.content.toString());
  const retryCount = msg.properties.headers?.['x-retry-count'] || 0;
  
  try {
    await processTask(task);
    channel.ack(msg); // Подтверждаем успешную обработку
  } catch (error) {
    console.error(`[Worker] Ошибка обработки задачи ${task.id}:`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      // Повторная отправка с увеличенным счётчиком
      const delay = getExponentialDelay(retryCount);
      console.log(`[Retry] Попытка ${retryCount + 1}/${MAX_RETRIES}. Повтор через ${Math.round(delay)}ms`);
      
      setTimeout(() => {
        channel.sendToQueue('task_queue', msg.content, {
          persistent: true,
          headers: { 'x-retry-count': retryCount + 1 }
        });
      }, delay);
      
      channel.nack(msg, false, false); // Отклоняем без возврата
    } else {
      // Исчерпаны все попытки — сообщение уйдёт в DLQ
      console.error(`[DLQ] Задача ${task.id} отправлена в Dead Letter Queue`);
      channel.nack(msg, false, false);
    }
  }
}

// Запуск воркера
export async function startWorker() {
  const channel = getChannel();
  if (!channel) {
    console.log('[Worker] RabbitMQ не подключён, воркер не запущен');
    return;
  }
  
  // Обрабатываем по одному сообщению
  channel.prefetch(1);
  
  channel.consume('task_queue', async (msg) => {
    if (!msg) return;
    await processWithRetry(msg, channel);
  });
  
  console.log('[Worker] Запущен, ожидание задач...');
}