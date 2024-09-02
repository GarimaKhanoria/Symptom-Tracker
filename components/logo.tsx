import { Brain } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Brain className="h-8 w-8 text-teal-600" />
      <span className="text-xl font-semibold text-teal-600">ADHD Symptom Tracker</span>
    </Link>
  )
}
