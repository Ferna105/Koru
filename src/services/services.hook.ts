import { useAuthService } from './auth/auth.services';
import { useMatchesService } from './matches/matches.services';

export const useServices = () => {
  const authService = useAuthService();
  const matchesService = useMatchesService();

  return { authService, matchesService };
};
