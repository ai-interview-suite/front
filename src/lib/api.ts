
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as {
      detail?: unknown;
      message?: unknown;
    } | null;

    const message =
      typeof errorData?.detail === "string"
        ? errorData.detail
        : typeof errorData?.message === "string"
          ? errorData.message
          : `Request failed (${response.status}).`;

    throw new Error(message);
  }

  return data as T;
}

export function postJson<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export function getJson<T>(
  path: string,
  token: string
): Promise<T> {
  return request<T>(path, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function postFormData<T>(
  path: string,
  formData: FormData,
  token: string
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}