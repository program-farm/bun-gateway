export function handleError(error: Error) {
  console.error('[ERROR]', error);
  return new Response(`{"name": "Internal Server Error", "message": ${error.message}}`, {status: 500});
}
