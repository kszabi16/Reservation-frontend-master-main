export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;

  const payload = token.split('.')[1];
  if (!payload) return null;

  try {
    const decoded = JSON.parse(atob(payload));

    return decoded["role"]
        || decoded["Role"]
        || decoded["roles"]
        || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || null;
  } catch {
    return null;
  }
}