import { useAuthService } from './auth/auth.services';

export const useServices = () => {
  const authService = useAuthService();

  return { authService };
};
