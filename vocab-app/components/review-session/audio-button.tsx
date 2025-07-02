"use client"

import { Button } from "@/components/ui/button"
import { playAudioByUrl, playAudioByWord } from "@/lib/utils"
import { Volume2 } from "lucide-react"
import { useEffect, useRef, useState, forwardRef } from "react"

interface AudioButtonProps {
  audioUrl: string
  word: string
  lang?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export const AudioButton = forwardRef<HTMLButtonElement, AudioButtonProps>(
  function AudioButton(
    {
      audioUrl,
      word,
      lang = "en-US",
      size = "icon",
      variant = "ghost",
      className = "",
    },
    ref
  ) {
    // Use a ref to track if audio has been played to prevent double playing
    const hasPlayedRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      hasPlayedRef.current = false;

      // Only play if it hasn't been played yet
      if (!hasPlayedRef.current) {
        setTimeout(() => {
          handleAudioPlay();
          hasPlayedRef.current = true;
        }, 100);
      }
    }, [word, audioUrl]); // Add dependencies to ensure it plays when these change

    const handleAudioPlay = async () => {
      setIsPlaying(true);

      try {
        await playAudioByWord(word, lang);
      } catch (error) {
        console.error("Error during audio playback:", error);
      } finally {
        setIsPlaying(false);
      }
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleAudioPlay}
        className={className}
        type="button"
        disabled={isPlaying}
      >
        <Volume2 className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
        {size !== "icon" && "Nghe"}
      </Button>
    )
  }
)

