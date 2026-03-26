export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payload = parts[1];

  try {
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decodedStr = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const decoded = JSON.parse(decodedStr);

    return decoded["role"]
        || decoded["Role"]
        || decoded["roles"]
        || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || null;
  } catch (error) {
    console.error('Hiba a token szerepkörének dekódolásakor', error);
    return null;
  }
}