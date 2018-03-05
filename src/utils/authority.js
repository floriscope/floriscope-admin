// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}
// use localStorage to store currentUser info
export function getCurrentUser() {
  return localStorage.getItem('floriscope-current-user') || null;
}

export function setCurrentUser(user) {
  return localStorage.setItem('floriscope-current-user', JSON.stringify(user));
}

export function clearCurrentUser() {
  return localStorage.removeItem('floriscope-current-user');
}
