import { parseCookies } from "nookies";

export function getSession() {
  const cookies = parseCookies();
  const user = cookies.user ? JSON.parse(cookies.user) : null;
  return user;
}
