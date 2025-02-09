export function getApplicationId(): string {
  return process.env.NEXT_PUBLIC_APPLICATION_ID ?? '';
}

export function getRpcPath(): string {
  return process.env.NEXT_PUBLIC_RPC_PATH ?? '';
}

export function getEnvContextId(): string {
  return process.env.NEXT_PUBLIC_CONTEXT_ID ?? '';
}
