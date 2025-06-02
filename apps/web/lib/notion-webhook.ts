import { notion } from './notion';

// 웹훅 설정 타입 정의
export interface WebhookConfig {
  url: string;
  event_types: string[];
  filter?: {
    property: string;
    checkbox?: {
      equals: boolean;
    };
  };
}

// 웹훅 생성 함수
export async function createNotionWebhook(config: WebhookConfig) {
  try {
    if (!process.env.NOTION_BLOG_DATABASE_ID) {
      throw new Error('NOTION_BLOG_DATABASE_ID is not configured');
    }

    const response = await notion.request({
      method: 'post',
      path: 'webhooks',
      body: {
        parent: {
          type: 'database_id',
          database_id: process.env.NOTION_BLOG_DATABASE_ID,
        },
        url: config.url,
        event_types: config.event_types,
        filter: config.filter,
      },
    });

    console.log('Webhook created successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to create webhook:', error);
    throw error;
  }
}

// 웹훅 목록 조회 함수
export async function listNotionWebhooks() {
  try {
    const response = await notion.request({
      method: 'get',
      path: 'webhooks',
    });

    console.log('Webhooks retrieved:', response);
    return response;
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    throw error;
  }
}

// 웹훅 삭제 함수
export async function deleteNotionWebhook(webhookId: string) {
  try {
    const response = await notion.request({
      method: 'delete',
      path: `webhooks/${webhookId}`,
    });

    console.log('Webhook deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to delete webhook:', error);
    throw error;
  }
}

// 웹훅 설정 헬퍼 함수
export function getWebhookConfig(baseUrl: string): WebhookConfig {
  return {
    url: `${baseUrl}/api/webhook/notion`,
    event_types: [
      'page.property_values.updated',
      'page.created',
      'page.deleted'
    ],
    filter: {
      property: 'Published',
      checkbox: {
        equals: true
      }
    }
  };
}

// 웹훅 상태 확인 함수
export async function checkWebhookStatus(webhookUrl: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: 'active',
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
} 