import api from './client'

export interface LoginResponse {
  token: string
  user: { id: string; username: string }
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }).then((r) => r.data),
}
