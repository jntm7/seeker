"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Cake, FileText, Upload } from "lucide-react"

export function ProfilePageContent() {
  const [name, setName] = useState("Dev User")
  const [location, setLocation] = useState("Toronto, ON")
  const [age, setAge] = useState("25")
  const [resumeName, setResumeName] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setResumeName(file.name)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Personal information and resume</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User size={16} className="text-muted-foreground" />
            Personal Info
          </CardTitle>
          <CardDescription>This information is only visible to you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={14} className="text-muted-foreground" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Cake size={14} className="text-muted-foreground" />
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={handleSave} className="px-6">
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText size={16} className="text-muted-foreground" />
            Resume
          </CardTitle>
          <CardDescription>Upload your resume to help with job discovery and application parsing</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed p-4 transition-colors hover:bg-muted/50">
            <Upload size={20} className="shrink-0 text-muted-foreground" />
            <div className="flex-1">
              {resumeName ? (
                <p className="text-sm font-medium">{resumeName}</p>
              ) : (
                <>
                  <p className="text-sm font-medium">Upload resume</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX, up to 10MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
        </CardContent>
      </Card>
    </div>
  )
}
