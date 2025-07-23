import { create } from "zustand";
import { persist, createJSONStorage} from "zustand/middleware"
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";

type State = {
	isLoggedIn : boolean,
	isOtpScreen : boolean,
	isPasswordScreen : boolean,
	_hasHydrated : boolean
}

type Actions = {
	setOtpScreen: () => void,
	setPasswordScreen: () => void,
	login: () => void,
	logout: () => void,
	setHasHydrated: (value: boolean) => void,
}

const initialState:  State = {
	isLoggedIn : false,
	isOtpScreen : false,
	isPasswordScreen : false,
	_hasHydrated : false
}

export const useAuthStore = create<State & Actions>()(
	persist(
		(set) => ({
			...initialState,
			setOtpScreen: () => set((state) => ({...state, isOtpScreen: true})),
			setPasswordScreen: () => set((state) => ({...state, isPasswordScreen: true})),
			login: () => set((state) => ({...state, isLoggedIn: true, isOtpScreen:false, isPasswordScreen: false})),
			logout: () => set((state) => ({...state, isLoggedIn: false})),
			setHasHydrated: (value) => set((state) => ({...state, _hasHydrated: value})),
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => ({
				getItem: getItemAsync,
				setItem: setItemAsync,
				removeItem: deleteItemAsync,
			})),
			onRehydrateStorage: (state) => {
				return () => state.setHasHydrated(true);
			}
		}
	)
);