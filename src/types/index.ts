export type Category =
  | 'Fashion'
  | 'Electronics'
  | 'Home'
  | 'Sports'
  | 'Toys'
  | 'Books'
  | 'Beauty'
  | 'Other';

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  joinedDate: string;
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: Category;
  condition: ListingCondition;
  description: string;
  sellerId: string;
  isSold: boolean;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type HomeStackParamList = {
  Listings: undefined;
  ProductDetail: {listingId?: string; listing?: Listing};
  SellerProfile: {sellerId: string};
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  ProductDetail: {listingId?: string; listing?: Listing};
  SellerProfile: {sellerId: string};
};

export type MainTabParamList = {
  Home: undefined;
  Sell: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export const categories: Category[] = [
  'Fashion',
  'Electronics',
  'Home',
  'Sports',
  'Toys',
  'Books',
  'Beauty',
  'Other',
];

export const conditions: ListingCondition[] = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
];
