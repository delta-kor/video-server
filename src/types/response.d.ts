interface ApiResponse {
  ok: boolean;
}

interface ApiResponseWithToken extends ApiResponse {
  token?: string;
}
