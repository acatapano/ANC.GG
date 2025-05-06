export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "anc.gg",
  description: "Search and View Your LoL Stats!",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Summoner Search",
      href: "/summonerSearch",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/acatapano/ANC.GG",
    linkedin: "https://www.linkedin.com/in/andrew-catapano/",
    summonerSearch: "/summonerSearch",
  },
};
