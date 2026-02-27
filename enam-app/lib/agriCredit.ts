/**
 * AgriCredit (AC) is a digital credit token pegged to MSP.
 * 1 AC = 1 kg of wheat at MSP = ₹22.75 (2024-25)
 *
 * Credits are only minted on trade completion — never on listing.
 * Platform fee: 1% per trade, stored in platform_wallet.
 * Decay: 2%/month after 12 months inactivity.
 */

export const MSP_RATES: Record<string, number> = {
  wheat: 2275,
  rice: 2300,
  maize: 2090,
  soybean: 4892,
  cotton: 7121,
  sugarcane: 340,
  onion: 800,
  tomato: 600,
  potato: 700,
  mustard: 5950,
  groundnut: 6783,
  sunflower: 7280,
  jowar: 3371,
  bajra: 2625,
  barley: 1735,
  lentil: 6425,
  chickpea: 5440,
};

export const AC_TO_INR = 22.75;
export const INR_TO_AC = 1 / AC_TO_INR;
export const PLATFORM_FEE_PCT = 0.01;

export function commodityToAC(commodity: string, quantityKg: number): number {
  const mspPerQtl = MSP_RATES[commodity.toLowerCase()] || MSP_RATES.wheat;
  const mspPerKg = mspPerQtl / 100;
  return Math.floor((mspPerKg * quantityKg) * INR_TO_AC);
}

export function acToINR(ac: number): number {
  return ac * AC_TO_INR;
}

export function calculateFee(tradeAmountAC: number) {
  const fee = Math.ceil(tradeAmountAC * PLATFORM_FEE_PCT);
  return { fee, sellerReceives: tradeAmountAC - fee };
}

export function checkCreditDecay(lastTransactionDate: Date, currentBalance: number) {
  const diffMs = Date.now() - lastTransactionDate.getTime();
  const monthsInactive = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
  if (monthsInactive >= 12) {
    const decayMonths = monthsInactive - 11;
    const newBalance = Math.floor(currentBalance * Math.pow(0.98, decayMonths));
    return { decayed: true, newBalance, monthsInactive };
  }
  return { decayed: false, newBalance: currentBalance, monthsInactive };
}

export const CREDIT_REWARDS = {
  listing_created: 5,
  trade_completed_seller: 10,
  first_trade_this_month: 25,
  community_verification: 15,
  quality_grade_a: 20,
  referral_new_farmer: 50,
};

export const COMMODITY_CATEGORIES = [
  { name: "Food Grains", items: ["Wheat", "Rice", "Maize", "Jowar", "Bajra", "Barley"], icon: "🌾" },
  { name: "Oilseeds", items: ["Soybean", "Mustard", "Groundnut", "Sunflower"], icon: "🫙" },
  { name: "Pulses", items: ["Lentil", "Chickpea"], icon: "🌱" },
  { name: "Cash Crops", items: ["Cotton", "Sugarcane"], icon: "🌿" },
  { name: "Vegetables", items: ["Onion", "Tomato", "Potato"], icon: "🥦" },
];
