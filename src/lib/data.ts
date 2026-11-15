export const CATEGORIES = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups",
];

export const LISTINGS = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  price: "$2,300",
  title: "Lorem ipsum dolor sit",
  location: "Palo Alto, CA",
  image: "/placeholder.svg", // Replace with real image URLs later
}));
