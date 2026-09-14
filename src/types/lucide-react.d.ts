// lucide-react@1.16.0 ships no TypeScript declarations.
// Wildcard declaration lets all icon imports type-check as LucideIcon components.
declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'
  export type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>
  export const Sparkles: LucideIcon
  export const Zap: LucideIcon
  export const Trophy: LucideIcon
  export const Quote: LucideIcon
  export const Bot: LucideIcon
  export const Search: LucideIcon
  export const Copy: LucideIcon
  export const Check: LucideIcon
  export const ArrowRight: LucideIcon
  export const Loader2: LucideIcon
  export const Flame: LucideIcon
  export const BarChart3: LucideIcon
  export const Shield: LucideIcon
  export const CheckCircle2: LucideIcon
  export const TrendingUp: LucideIcon
  export const MessageSquare: LucideIcon
  export const Mail: LucideIcon
  export const X: LucideIcon
  export const Menu: LucideIcon
  export const Play: LucideIcon
  export const ChevronRight: LucideIcon
  export const Star: LucideIcon
  export const Users: LucideIcon
  export const Globe: LucideIcon
  export const Lock: LucideIcon
}

