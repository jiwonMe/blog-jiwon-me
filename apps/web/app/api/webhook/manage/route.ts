import { NextRequest, NextResponse } from 'next/server';
import { 
  createNotionWebhook, 
  listNotionWebhooks, 
  deleteNotionWebhook, 
  getWebhookConfig,
  checkWebhookStatus 
} from '../../../../lib/notion-webhook';

// 웹훅 생성
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const baseUrl = searchParams.get('baseUrl');

    // 보안 검증
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'baseUrl parameter is required' },
        { status: 400 }
      );
    }

    // 웹훅 설정 생성
    const webhookConfig = getWebhookConfig(baseUrl);
    
    // 웹훅 생성
    const webhook = await createNotionWebhook(webhookConfig);

    return NextResponse.json({
      message: 'Webhook created successfully',
      webhook,
      config: webhookConfig,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create webhook',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 웹훅 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const action = searchParams.get('action');
    const webhookUrl = searchParams.get('webhookUrl');

    // 보안 검증
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // 웹훅 상태 확인
    if (action === 'status' && webhookUrl) {
      const status = await checkWebhookStatus(webhookUrl);
      return NextResponse.json({
        action: 'status_check',
        webhookUrl,
        ...status
      });
    }

    // 웹훅 목록 조회
    const webhooks = await listNotionWebhooks();

    return NextResponse.json({
      message: 'Webhooks retrieved successfully',
      webhooks,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error retrieving webhooks:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve webhooks',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 웹훅 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const webhookId = searchParams.get('webhookId');

    // 보안 검증
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!webhookId) {
      return NextResponse.json(
        { error: 'webhookId parameter is required' },
        { status: 400 }
      );
    }

    // 웹훅 삭제
    const result = await deleteNotionWebhook(webhookId);

    return NextResponse.json({
      message: 'Webhook deleted successfully',
      webhookId,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete webhook',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 