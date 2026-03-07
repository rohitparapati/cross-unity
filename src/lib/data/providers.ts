import { Provider } from "../types/provider"

export const providers: Provider[] = [
  {
    id: "1",
    name: "Mike's Plumbing",
    category: "Plumber",
    city: "St Louis",
    rating: 4.8,
    verified: true,
    description: "Professional plumbing services for homes and businesses."
  },
  {
    id: "2",
    name: "Spark Electric",
    category: "Electrician",
    city: "St Louis",
    rating: 4.6,
    verified: true,
    description: "Certified electricians for installations and repairs."
  },
  {
    id: "3",
    name: "Green Lawn Care",
    category: "Landscaping",
    city: "St Louis",
    rating: 4.5,
    verified: false,
    description: "Affordable lawn maintenance and landscaping."
  }
]