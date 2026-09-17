export interface BrowserTool {
  annotations: { readOnlyHint: boolean };
  description: string;
  execute: (input: unknown) => unknown;
  inputSchema: {
    additionalProperties: boolean;
    properties: Record<string, { pattern?: string; type: string }>;
    type: string;
  };
  name: string;
  title: string;
}

interface ModelContext {
  registerTool: (tool: BrowserTool, options: { signal: AbortSignal }) => unknown;
}

export function isModelContext(value: unknown): value is ModelContext {
  return typeof value === 'object' && value !== null && 'registerTool' in value && typeof value.registerTool === 'function';
}
