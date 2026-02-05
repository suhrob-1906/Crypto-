import { apiFetch } from './http'

export async function register(username, email, password) {
  return apiFetch('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export async function login(username, password) {
  return apiFetch('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function me() {
  return apiFetch('/api/me/')
}
