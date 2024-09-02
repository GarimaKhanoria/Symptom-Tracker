"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SymptomSliderProps {
  name: string
  category: string
  description?: string
  onValueChange?: (value: number) => void
}

export function SymptomSlider({ name, category, description, onValueChange }: SymptomSliderProps) {
  const [value, setValue] = useState(0)

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0]
    setValue(val)
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h3 className="font-medium">{name}</h3>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{category}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">Not noticeable</span>
        <Slider value={[value]} min={0} max={10} step={1} onValueChange={handleValueChange} className="flex-1" />
        <span className="text-xs text-muted-foreground">Severe</span>
        <span className="ml-2 w-6 text-center font-medium">{value}</span>
      </div>
    </div>
  )
}
