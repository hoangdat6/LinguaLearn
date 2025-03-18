"use client"

import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"

interface AudioButtonProps {
  text: string
  lang?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function AudioButton({
  text,
  lang = "en-US",
  size = "icon",
  variant = "ghost",
  className = "",
}: AudioButtonProps) {
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  }

  return (
    <Button variant={variant} size={size} onClick={playAudio} className={className} type="button">
      <Volume2 className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
      {size !== "icon" && "Nghe"}
    </Button>
  )
}

