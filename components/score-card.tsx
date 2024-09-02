interface ScoreCardProps {
  score: number
  label: string
  severity: "fair" | "moderate" | "major" | "severe"
}

export function ScoreCard({ score, label, severity }: ScoreCardProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case "fair":
        return "bg-green-50 text-green-700"
      case "moderate":
        return "bg-yellow-50 text-yellow-700"
      case "major":
        return "bg-pink-50 text-pink-700"
      case "severe":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold">{score}</p>
        <p className="ml-1 text-sm text-muted-foreground">Total Score</p>
      </div>
      <div className={`mt-4 rounded-md px-2.5 py-1 text-xs font-medium ${getSeverityColor()}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </div>
    </div>
  )
}
