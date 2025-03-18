"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Bookmark, BookmarkCheck, Copy, ExternalLink } from 'lucide-react'
import { motion } from "framer-motion"

interface WordDetailsProps {
  word: {
    word: string
    phonetic: string
    partOfSpeech: string
    definitions: string[]
    examples: string[]
    synonyms: string[]
    antonyms: string[]
    etymology?: string
  }
  isSaved: boolean
  onToggleSave: () => void
}

export function DictionaryWordDetails({ word, isSaved, onToggleSave }: WordDetailsProps) {
  const [copied, setCopied] = useState(false)

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const copyToClipboard = () => {
    const textToCopy = `${word.word} (${word.partOfSpeech}): ${word.definitions[0]}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">{word.word}</h2>
            <Button variant="outline" size="icon" onClick={playAudio}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{word.phonetic}</span>
            <Badge variant="outline" className="text-xs">
              {word.partOfSpeech}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={copyToClipboard}
            className="relative"
          >
            <Copy className="h-4 w-4" />
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border rounded px-2 py-1 text-xs whitespace-nowrap"
              >
                Đã sao chép!
              </motion.div>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleSave}
            className={isSaved ? "text-yellow-500" : ""}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 fill-yellow-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="definitions" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="definitions">Định nghĩa</TabsTrigger>
          <TabsTrigger value="examples">Ví dụ</TabsTrigger>
          <TabsTrigger value="synonyms">Từ đồng nghĩa</TabsTrigger>
          <TabsTrigger value="etymology">Nguồn gốc</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="pt-4">
          <h3 className="text-lg font-medium mb-3">Định nghĩa</h3>
          <ul className="space-y-3">
            {word.definitions.map((definition, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start"
              >
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{definition}</span>
              </motion.li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="examples" className="pt-4">
          <h3 className="text-lg font-medium mb-3">Ví dụ</h3>
          <ul className="space-y-3">
            {word.examples.map((example, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-muted/50 p-3 rounded-md italic"
              >
                "{example}"
              </motion.li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="synonyms" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Từ đồng nghĩa</h3>
              <div className="flex flex-wrap gap-2">
                {word.synonyms.map((synonym, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge variant="secondary" className="text-sm">
                      {synonym}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Từ trái nghĩa</h3>
              <div className="flex flex-wrap gap-2">
                {word.antonyms.map((antonym, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge variant="outline" className="text-sm">
                      {antonym}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="etymology" className="pt-4">
          <h3 className="text-lg font-medium mb-3">Nguồn gốc từ</h3>
          <p className="text-muted-foreground">
            {word.etymology || "Không có thông tin về nguồn gốc từ này."}
          </p>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Tìm hiểu thêm</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Oxford Dictionary
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Cambridge Dictionary
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}