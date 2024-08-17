// // actions/fetch-currencies.ts
// "use server";

// import { prisma } from "@/lib/db";

// export async function fetchCurrencies() {
//   const currencies = await prisma.currency.findMany({
//     select: {
//       iso: true,
//       symbol: true,
//     },
//   });

//   return currencies;
// }

export const fetchCurrencies = () => {
  return [
    { iso: "EUR", symbol: "€", name: "Euro" },
    { iso: "USD", symbol: "$", name: "American Dollar" },
    { iso: "NOK", symbol: "kr", name: "Norwegian Kroner" },
    { iso: "GBP", symbol: "£", name: "British Pound" },
    { iso: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];
};
