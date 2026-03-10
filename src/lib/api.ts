export type ApiSuccess<T> = {
  ok: true;
  message?: string;
  data: T;
};

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export function successResponse<T>(data: T, message?: string): ApiSuccess<T> {
  return {
    ok: true,
    message,
    data,
  };
}

export function errorResponse(
  code: string,
  message: string,
  fieldErrors?: Record<string, string[]>,
): ApiError {
  return {
    ok: false,
    error: {
      code,
      message,
      fieldErrors,
    },
  };
}