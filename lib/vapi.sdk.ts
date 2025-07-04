// ✅ Force correct typing explicitly
import Vapi from '@vapi-ai/web';

const apiKey = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN as string;

export const vapi = new (Vapi as any)({
  apiKey,
});
