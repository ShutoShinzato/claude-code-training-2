import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('200ステータスコードを返すこと', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('レスポンスボディにstatusフィールドが含まれること', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });

  it('レスポンスボディにtimestampフィールドが含まれること', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('timestamp');
  });

  it('timestampがISO 8601形式であること', async () => {
    const response = await GET();
    const data = await response.json();
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(data.timestamp).toMatch(isoDateRegex);
  });

  it('レスポンスのContent-TypeがJSONであること', async () => {
    const response = await GET();
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  });
});
