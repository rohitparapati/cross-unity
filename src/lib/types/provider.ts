export type ProviderListItem = {
  id: string;
  businessName: string;
  slug: string;
  email: string;
  phone: string | null;
  bio: string;
  city: string;
  state: string;
  zip: string;
  pricingText: string | null;
  availabilityText: string | null;
  isVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
};