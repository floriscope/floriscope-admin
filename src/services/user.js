import request from '../utils/request';
import { getCurrentUser } from '../utils/authority';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  const current = await getCurrentUser();
  return JSON.parse(current);
}
