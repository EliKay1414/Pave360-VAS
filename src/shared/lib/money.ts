export function ghs(amount: number) {
  return `GH₵ ${amount.toFixed(2)}`
}

export function ghsExact(amount: number, digits = 3) {
  return `GH₵ ${amount.toFixed(digits)}`
}

export function roundMoney(amount: number, digits = 4) {
  const f = 10 ** digits
  return Math.round((amount + Number.EPSILON) * f) / f
}

export function sellFromCost(wholesale: number, marginPct: number) {
  return roundMoney(wholesale * (1 + marginPct / 100), 4)
}

export function marginPctFromPrices(wholesale: number, sell: number) {
  if (wholesale <= 0) return 0
  return roundMoney(((sell - wholesale) / wholesale) * 100, 2)
}

export function marginAmount(wholesale: number, sell: number) {
  return roundMoney(sell - wholesale, 4)
}
