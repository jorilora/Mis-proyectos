import api from './client'

export interface LoginResponse {
  token: string
  user: { id: string; username: string }
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }).then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<{ message: string }>('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),

  changeUsername: (newUsername: string, password: string) =>
    api.put<{ message: string; user: { id: string; username: string } }>('/auth/change-username', { newUsername, password }).then((r) => r.data),
}
