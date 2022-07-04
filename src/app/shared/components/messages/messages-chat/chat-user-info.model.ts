export interface ChatUserInfo {
  userName: string;
  type: 'COMPANY' | 'TALENT';
  name?: string;
  firstName?: string;
  lastName?: string;
}