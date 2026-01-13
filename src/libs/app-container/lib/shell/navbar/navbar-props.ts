export interface NavbarItemProps {
  title: string;
  url: string;
  loggedInRequired: boolean;
}

export const navItems: NavbarItemProps[] = [
  {
    title: 'Colors',
    url: '/colors',
    loggedInRequired: true,
  },
  {
    title: 'Plans',
    url: '/plans',
    loggedInRequired: true,
  },
  {
    title: 'Kitchens',
    url: '/kitchens',
    loggedInRequired: true,
  },
  {
    title: 'Login',
    url: '/login',
    loggedInRequired: false,
  },
];
