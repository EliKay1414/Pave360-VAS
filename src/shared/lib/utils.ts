import { twMerge } from "tailwind-merge"

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: any }
  | ClassValue[]

function toVal(mix: ClassValue): string {
  let str = ""
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k])
          if (y) {
            str && (str += " ")
            str += y
          }
        }
      }
    } else if (mix) {
      for (const k in mix) {
        if (mix[k]) {
          str && (str += " ")
          str += k
        }
      }
    }
  }
  return str
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(inputs.map(toVal).filter(Boolean).join(" "))
}
