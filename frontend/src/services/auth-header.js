export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // Check for both token and accessToken
    const token = user.token || user.accessToken;
    if (token) {
      return { Authorization: 'Bearer ' + token };
    }
  }
  
  return {};
}