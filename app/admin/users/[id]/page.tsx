"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreCard } from "@/components/score-card"
import { SymptomChart } from "@/components/symptom-chart"

// Mock data
const mockChartData = [
  { date: "Dec 17", score: 150 },
  { date: "Dec 18", score: 120 },
  { date: "Dec 19", score: 90 },
  { date: "Dec 20", score: 60 },
  { date: "Dec 21", score: 40 },
]

const mockBaselineData = [
  { date: "Dec 17", score: 0 },
  { date: "Dec 18", score: -10 },
  { date: "Dec 19", score: -20 },
  { date: "Dec 20", score: -30 },
  { date: "Dec 21", score: -40 },
]

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center text-red-500">
            <Link href="/admin" className="flex items-center gap-2 text-teal-600">
              <ArrowLeft className="h-4 w-4" />
              Return to Admin
            </Link>
          </div>
          <div className="ml-auto">
            <h1 className="text-xl font-bold">Viewing: Lindsay</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="mt-1 font-medium">Lindsay</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                  <p className="mt-1 font-medium">Not set</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
                  <p className="mt-1 font-medium">Not set</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                  <p className="mt-1 font-medium">Female</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold">Daily Symptom Log</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Symptom Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">Select Symptom:</span>
                        <select className="rounded-md border p-1 text-sm">
                          <option>All Symptoms</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={timeRange === "week" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange("week")}
                          className={timeRange === "week" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          Week
                        </Button>
                        <Button
                          variant={timeRange === "month" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange("month")}
                          className={timeRange === "month" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          Month
                        </Button>
                        <Button
                          variant={timeRange === "3months" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange("3months")}
                          className={timeRange === "3months" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          3 Months
                        </Button>
                        <Button
                          variant={timeRange === "year" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange("year")}
                          className={timeRange === "year" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          Year
                        </Button>
                      </div>
                    </div>
                    <SymptomChart data={mockChartData} />
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Symptom Score Change from Baseline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SymptomChart data={mockBaselineData} />
                  </CardContent>
                </Card>
              </div>

              <div>
                <ScoreCard score={16} label="Symptom Total Score Card" severity="fair" />
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Score Ranges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between rounded-md bg-green-50 p-2">
                        <span className="text-sm">0-30</span>
                        <span className="text-sm font-medium text-green-700">Fair</span>
                      </div>
                      <div className="flex justify-between rounded-md bg-yellow-50 p-2">
                        <span className="text-sm">31-50</span>
                        <span className="text-sm font-medium text-yellow-700">Moderate</span>
                      </div>
                      <div className="flex justify-between rounded-md bg-pink-50 p-2">
                        <span className="text-sm">51-80</span>
                        <span className="text-sm font-medium text-pink-700">Major</span>
                      </div>
                      <div className="flex justify-between rounded-md bg-red-50 p-2">
                        <span className="text-sm">&gt;80</span>
                        <span className="text-sm font-medium text-red-700">Severe</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
