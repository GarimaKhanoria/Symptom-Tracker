"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, LogOut, Plus, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SymptomChart } from "@/components/symptom-chart"

// Mock data
const mockUsers = [
  { id: 1, name: "Lindsay", gender: "Female", createdAt: "12/17/2024" },
  { id: 2, name: "Matt", gender: "Male", createdAt: "4/15/2025" },
  { id: 3, name: "Peter Piper", gender: "Prefer Not-To-Say", createdAt: "4/20/2025" },
  { id: 4, name: "Reed Admin", gender: "Prefer Not-To-Say", createdAt: "11/19/2024" },
  { id: 5, name: "Doe", gender: "N/A", createdAt: "11/27/2024" },
  { id: 6, name: "RS", gender: "Prefer Not-To-Say", createdAt: "12/4/2024" },
  { id: 7, name: "Denys Soen", gender: "Male", createdAt: "4/20/2025" },
  { id: 8, name: "Chip K'Nee", gender: "Male", createdAt: "4/20/2025" },
]

const mockSymptoms = [
  { id: 1, name: "Hyperactivity", category: "Behavioral" },
  { id: 2, name: "Impulsivity / acts without thinking", category: "Behavioral" },
  { id: 3, name: "Trouble paying attention / staying focused", category: "Behavioral" },
  { id: 4, name: "Forgetful / loses things", category: "Behavioral" },
  { id: 5, name: "Anxiety / worry", category: "Emotional" },
  { id: 6, name: "Sad / moody", category: "Emotional" },
  { id: 7, name: "Irritable / angry", category: "Behavioral" },
  { id: 8, name: "Rude / cruel / hateful", category: "Behavioral" },
  { id: 9, name: "Tantrums", category: "Behavioral" },
  { id: 10, name: "Physical aggression", category: "Behavioral" },
  { id: 11, name: "Disobedient / defiance", category: "Behavioral" },
  { id: 12, name: "Sleep problems", category: "Physical" },
  { id: 13, name: "Picky Eating", category: "Physical" },
  { id: 14, name: "Gut Symptoms - Gas or bloating", category: "Physical" },
  { id: 15, name: "Gut Symptoms - Constipation", category: "Physical" },
  { id: 16, name: "Gut Symptoms - Diarrhea", category: "Physical" },
]

const mockChartData = [
  { date: "Apr 1", score: 0 },
  { date: "Apr 8", score: -5 },
  { date: "Apr 15", score: -10 },
  { date: "Apr 22", score: -15 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [newSymptom, setNewSymptom] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Behavioral")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="users" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="symptoms" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Symptoms
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button variant="outline" size="sm" className="bg-teal-600 text-white hover:bg-teal-700">
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search users..." className="max-w-sm" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                          <th className="px-4 py-3">NAME</th>
                          <th className="px-4 py-3">GENDER</th>
                          <th className="px-4 py-3">CREATED AT</th>
                          <th className="px-4 py-3">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="px-4 py-3">{user.name}</td>
                            <td className="px-4 py-3">{user.gender}</td>
                            <td className="px-4 py-3">{user.createdAt}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/admin/users/${user.id}`}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="col-span-3 md:col-span-1">
                      <div className="rounded-lg border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">Overall Change</h3>
                        <p className="mt-2 text-3xl font-bold text-green-600">0.0%</p>
                        <p className="text-xs text-muted-foreground">Improvement</p>
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 text-sm font-medium">Monthly Trends</h3>
                        <SymptomChart data={mockChartData} />
                        <div className="mt-2 text-center text-xs text-muted-foreground">
                          <p>Downward trend indicates improvement (reduction in symptoms)</p>
                          <p>Upward trend indicates worsening symptoms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="symptoms">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <h3 className="text-lg font-medium">Add New Symptom</h3>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Input
                        placeholder="Enter symptom name"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-md border p-2"
                      >
                        <option value="Behavioral">Behavioral</option>
                        <option value="Emotional">Emotional</option>
                        <option value="Physical">Physical</option>
                      </select>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <h3 className="mb-4 text-lg font-medium">Current Symptoms</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {mockSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{symptom.name}</p>
                          <p className="text-sm text-muted-foreground">{symptom.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-medium">General Settings</h3>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="site-name" className="text-sm font-medium">
                            Site Name
                          </label>
                          <Input id="site-name" defaultValue="ADHD Symptom Tracker" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="site-url" className="text-sm font-medium">
                            Site URL
                          </label>
                          <Input id="site-url" defaultValue="https://adhdsymptomtracker.com" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Email Settings</h3>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="admin-email" className="text-sm font-medium">
                            Admin Email
                          </label>
                          <Input id="admin-email" type="email" defaultValue="admin@adhdsymptomtracker.com" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="notification-email" className="text-sm font-medium">
                            Notification Email
                          </label>
                          <Input
                            id="notification-email"
                            type="email"
                            defaultValue="notifications@adhdsymptomtracker.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-teal-600 hover:bg-teal-700">Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
