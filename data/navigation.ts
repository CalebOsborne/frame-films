export type NavItem = {
  label: string;
  href: string;
  shortLabel?: string;
};

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Watchlist", href: "/watchlist" },
];

export const headerQuickLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Trending", shortLabel: "Trending", href: "/search?sort=popularity" },
  { label: "New Releases", shortLabel: "New", href: "/search?sort=release_date" },
  { label: "Top Rated", shortLabel: "Top", href: "/search?sort=rating" },
  { label: "Movie Series", shortLabel: "Series", href: "/#movie-series" },
];

export const mobileNavigation: NavItem[] = [
  ...headerQuickLinks,
  { label: "Watchlist", href: "/watchlist" },
];

export const footerNavigation = {
  explore: [
    { label: "New Releases", href: "/search?sort=release_date" },
    { label: "Trending", href: "/search?sort=popularity" },
    { label: "Top Rated", href: "/search?sort=rating" },
    { label: "Movie Series", href: "/#movie-series" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const genreFilters = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

export const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release_date", label: "Release Date" },
  { value: "release_date.asc", label: "Oldest First" },
];
