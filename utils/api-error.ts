export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data.message || 'An error occurred',
      error.response.data
    );
  }
  throw new ApiError(500, error.message || 'Network error occurred');
}; 