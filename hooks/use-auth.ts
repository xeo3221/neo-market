import { useAuth as useClerkAuth } from "@clerk/nextjs";

export const useAuth = () => {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();

  return {
    userId: userId || null,
    isAuthenticated: isSignedIn,
    isLoaded,
  };
};
