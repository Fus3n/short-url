import { create } from "zustand";
import { User } from '../types';
import { getMe } from '../lib/utils';

// User store for client side

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: User | null) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true });
    const user = await getMe();
    set({ user, isLoading: false });
  },
}));

// Fetch user data when the store is created
useUserStore.getState().fetchUser();

export default useUserStore;