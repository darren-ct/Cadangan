import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

import { User } from "../types";

interface State {
  loggedUser: User | null;
  setLoggedUser: (user: User | null) => void;
}

export const usePreviewPageStore = create<State>(
  (
    persist as unknown as (
      config: StateCreator<State>,
      options: PersistOptions<State>
    ) => StateCreator<State>
  )(
    (set) => ({
      loggedUser: null,
      setLoggedUser: (user) => set({ loggedUser: user }),
    }),
    {
      name: "previewLoggedUserData",
    }
  )
);
