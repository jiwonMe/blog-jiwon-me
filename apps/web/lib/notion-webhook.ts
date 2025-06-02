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

// Notion API 기본 설정
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// 웹훅 생성 함수
export async function createNotionWebhook(config: WebhookConfig) {
  try {
    if (!process.env.NOTION_BLOG_DATABASE_ID) {
      throw new Error('NOTION_BLOG_DATABASE_ID is not configured');
    }

    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN is not configured');
    }

    const response = await fetch(`${NOTION_API_BASE}/webhooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: {
          type: 'database_id',
          database_id: process.env.NOTION_BLOG_DATABASE_ID,
        },
        url: config.url,
        event_types: config.event_types,
        filter: config.filter,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API Error:', errorData);
      throw new Error(`Notion API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Webhook created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create webhook:', error);
    throw error;
  }
}

// 웹훅 목록 조회 함수
export async function listNotionWebhooks() {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN is not configured');
    }

    const response = await fetch(`${NOTION_API_BASE}/webhooks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API Error:', errorData);
      throw new Error(`Notion API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Webhooks retrieved:', data);
    return data;
  } catch (error) {
    console.error('Failed to list webhooks:', error);
    throw error;
  }
}

// 웹훅 삭제 함수
export async function deleteNotionWebhook(webhookId: string) {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN is not configured');
    }

    const response = await fetch(`${NOTION_API_BASE}/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API Error:', errorData);
      throw new Error(`Notion API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Webhook deleted successfully:', data);
    return data;
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