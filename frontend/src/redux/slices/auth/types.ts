export enum SelectedTab {
  left = 'left',
  right = 'right',
}

export type CheckResult = {
  ok: boolean;
  username?: string;
  is_admin?: boolean;
};

export type LoginRegisterPayload = {
  username: string;
  password: string;
};

export type AuthState = {
  selectedTab: SelectedTab,
  isLoading: boolean,
};
