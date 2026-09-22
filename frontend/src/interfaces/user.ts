export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}
