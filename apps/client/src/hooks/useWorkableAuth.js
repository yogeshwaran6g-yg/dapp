import { useAuthContext } from '../context/AuthContext';

/**
 * useWorkableAuth - A wrapper hook that provides access to the global authentication context.
 * This hook is used to maintain backward compatibility and provide a clean interface for components.
 */
export const useWorkableAuth = () => {
    return useAuthContext();
};
