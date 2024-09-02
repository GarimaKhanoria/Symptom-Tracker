"use client"

import { useState } from "react"
import { Calendar, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { ScoreCard } from "@/components/score-card"
import { SymptomChart } from "@/components/symptom-chart"
import { SymptomSlider } from "@/components/symptom-slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockChartData = [
  { date: "Apr 16", score: 120 },
  { date: "Apr 17", score: 115 },
  { date: "Apr 18", score: 110 },
  { date: "Apr 19", score: 105 },
  { date: "Apr 20", score: 100 },
  { date: "Apr 21", score: 95 },
  { date: "Apr 22", score: 90 },
]

const mockBaselineData = [
  { date: "Apr 16", score: 0 },
  { date: "Apr 17", score: -5 },
  { date: "Apr 18", score: -10 },
  { date: "Apr 19", score: -15 },
  { date: "Apr 20", score: -20 },
  { date: "Apr 21", score: -25 },
  { date: "Apr 22", score: -30 },
]

const mockSymptoms = [
  { name: "Hyperactivity", category: "Behavioral", description: "Excessive movement and restlessness" },
  {
    name: "Impulsivity / acts without thinking",
    category: "Behavioral",
    description: "Acting without considering consequences",
  },
  {
    name: "Trouble paying attention / staying focused",
    category: "Behavioral",
    description: "Difficulty maintaining focus on tasks",
  },
  {
    name: "Forgetful / loses things",
    category: "Behavioral",
    description: "Frequently misplacing items or forgetting important information",
  },
  { name: "Anxiety / worry", category: "Emotional", description: "Excessive worry or nervousness" },
  { name: "Sad / moody", category: "Emotional", description: "Feelings of sadness or mood swings" },
  { name: "Irritable / angry", category: "Behavioral", description: "Easily annoyed or prone to anger" },
  { name: "Rude / cruel / hateful", category: "Behavioral", description: "Displaying unkind behavior toward others" },
  { name: "Tantrums", category: "Behavioral", description: "Emotional outbursts" },
  { name: "Physical aggression", category: "Behavioral", description: "Physical actions toward others or objects" },
  { name: "Disobedient / defiance", category: "Behavioral", description: "Refusing to follow rules or directions" },
  { name: "Sleep problems", category: "Physical", description: "Difficulty falling asleep or staying asleep" },
  { name: "Picky Eating", category: "Physical", description: "Selective about food choices" },
  { name: "Gut Symptoms - Gas or bloating", category: "Physical", description: "Digestive discomfort" },
  { name: "Gut Symptoms - Constipation", category: "Physical", description: "Difficulty with bowel movements" },
  { name: "Gut Symptoms - Diarrhea", category: "Physical", description: "Loose or watery stools" },
]

export default function DashboardPage() {
  const [currentDate] = useState(new Date())
  const [selectedTab, setSelectedTab] = useState("all-symptoms")
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <div className="mx-auto grid max-w-6xl gap-6">
          {/* Profile Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">Profile Overview</h2>
                    <p className="text-sm text-muted-foreground">Last updated: Apr 21, 2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="mt-1">Martha Kidd</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="mt-1">April 22, 2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p className="mt-1">Not set</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="mt-1">Male</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Symptom Log */}
          <div>
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold">Daily Symptom Log</h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

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
                          <option value="all">All Symptoms</option>
                          {mockSymptoms.map((symptom) => (
                            <option key={symptom.name} value={symptom.name}>
                              {symptom.name}
                            </option>
                          ))}
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
                          variant={timeRange === "6months" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRange("6months")}
                          className={timeRange === "6months" ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          6 Months
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
                    <SymptomChart data={mockChartData} title="Symptom Score Trends" />
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
                <ScoreCard score={104} label="Symptom Total Score Card" severity="severe" />
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

          {/* Symptoms */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Symptoms</h2>
            <Tabs defaultValue="all-symptoms" onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all-symptoms">All Symptoms</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                <TabsTrigger value="emotional">Emotional</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
              </TabsList>
              <TabsContent value="all-symptoms">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {mockSymptoms.map((symptom) => (
                        <SymptomSlider
                          key={symptom.name}
                          name={symptom.name}
                          category={symptom.category}
                          description={symptom.description}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="behavioral">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {mockSymptoms
                        .filter((s) => s.category === "Behavioral")
                        .map((symptom) => (
                          <SymptomSlider
                            key={symptom.name}
                            name={symptom.name}
                            category={symptom.category}
                            description={symptom.description}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="emotional">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {mockSymptoms
                        .filter((s) => s.category === "Emotional")
                        .map((symptom) => (
                          <SymptomSlider
                            key={symptom.name}
                            name={symptom.name}
                            category={symptom.category}
                            description={symptom.description}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="physical">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {mockSymptoms
                        .filter((s) => s.category === "Physical")
                        .map((symptom) => (
                          <SymptomSlider
                            key={symptom.name}
                            name={symptom.name}
                            category={symptom.category}
                            description={symptom.description}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Save Today's Entry
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
