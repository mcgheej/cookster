export interface NavbarItemProps {
  title: string;
  url: string;
  loggedInRequired: boolean;
}

export const navItems: NavbarItemProps[] = [
  {
    title: 'Plans',
    url: '/plans',
    loggedInRequired: true,
  },
  {
    title: 'Login',
    url: '/login',
    loggedInRequired: false,
  },
];
