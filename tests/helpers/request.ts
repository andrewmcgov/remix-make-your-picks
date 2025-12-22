/**
 * Creates a mock Request object with FormData for testing form submissions
 */
export function createMockRequest(
  formData: Record<string, string>,
  options: {method?: string; headers?: Record<string, string>} = {}
): Request {
  const {method = 'POST', headers = {}} = options;

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  return new Request('http://localhost/test', {
    method,
    body,
    headers: new Headers(headers),
  });
}

/**
 * Creates a mock Request with a cookie header
 */
export function createMockRequestWithCookie(
  formData: Record<string, string>,
  cookie: string
): Request {
  return createMockRequest(formData, {
    headers: {Cookie: cookie},
  });
}
