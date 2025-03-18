import { Button } from "@/components/ui/button"
import { Bookmark, Volume2 } from "lucide-react"

export function SavedWords() {
  const savedWords = [
    { id: 1, word: "Accomplish", meaning: "Hoàn thành", example: "She accomplished her goal." },
    { id: 2, word: "Determine", meaning: "Quyết định", example: "We need to determine the cause." },
    { id: 3, word: "Enhance", meaning: "Nâng cao", example: "This will enhance your skills." },
    { id: 4, word: "Facilitate", meaning: "Tạo điều kiện", example: "The program facilitates learning." },
  ]

  return (
    <div className="space-y-4">
      {savedWords.map((word) => (
        <div key={word.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{word.word}</h4>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{word.meaning}</p>
              <p className="text-sm italic">{word.example}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4 fill-primary text-primary" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        Xem tất cả
      </Button>
    </div>
  )
}

