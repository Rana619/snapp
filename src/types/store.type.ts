export interface ConfigStore {
    theme: string;
    rememberedEmail: string;
}

export interface User {
    name: string;
    email: string;
    roles: string[];
}

export interface UserStore {
    authToken: string;
    user: User;
}

export interface RootState {
    user: UserStore;
    config: ConfigStore;
}