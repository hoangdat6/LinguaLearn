"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Bookmark, BookmarkCheck, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface SentenceAudio {
  key: string    // English sentence
  audio: string  // Audio file path
  trans: string  // Vietnamese translation
}

interface Definition {
  translation: string
  sentence_audio: SentenceAudio[]
}

interface WordDetailsProps {
  word: {
    word: string
    phonetic_us: string
    phonetic_uk: string
    audio_us: string
    audio_uk: string
    partOfSpeech: string
    definitions: Definition[]
    synonyms: string[]
    antonyms: string[]
    etymology?: string
  }
  isSaved: boolean
  onToggleSave: () => void
}

export function DictionaryWordDetails({ word, isSaved, onToggleSave }: WordDetailsProps) {
  const [copied, setCopied] = useState(false)
  const [activeDefinition, setActiveDefinition] = useState(0)
  const [expandedExamples, setExpandedExamples] = useState<number[]>([])
  const [visibleTranslations, setVisibleTranslations] = useState<string[]>([])

  const playAudio = (accent: 'us' | 'uk') => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = accent === 'us' ? "en-US" : "en-GB"
    window.speechSynthesis.speak(utterance)
  }

  const playExampleAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const copyToClipboard = () => {
    const textToCopy = `${word.word} (${word.partOfSpeech}): ${word.definitions[0].translation}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleExpandExample = (definitionIndex: number) => {
    setExpandedExamples(prev => 
      prev.includes(definitionIndex) 
        ? prev.filter(i => i !== definitionIndex) 
        : [...prev, definitionIndex]
    )
  }

  const isExampleExpanded = (definitionIndex: number) => {
    return expandedExamples.includes(definitionIndex)
  }

  const toggleTranslation = (id: string) => {
    setVisibleTranslations(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const isTranslationVisible = (id: string) => {
    return visibleTranslations.includes(id)
  }

  // Create a unique ID for each example sentence
  const getExampleId = (definitionIndex: number, exampleIndex: number) => {
    return `def-${definitionIndex}-ex-${exampleIndex}`
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">{word.word}</h2>
            <Badge variant="outline" className="text-xs">
              {word.partOfSpeech}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground font-bold">US</span>
            <span className="text-muted-foreground">{word.phonetic_us}</span>
            <Button variant="outline" size="icon" onClick={() => playAudio('us')}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground font-bold">UK</span>
            <span className="text-muted-foreground">{word.phonetic_uk}</span>
            <Button variant="outline" size="icon" onClick={() => playAudio('uk')}>
              <Volume2 className="h-4 w-4" />
            </Button>
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
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="definitions">Định nghĩa & Ví dụ</TabsTrigger>
          <TabsTrigger value="synonyms">Từ đồng nghĩa</TabsTrigger>
          <TabsTrigger value="etymology">Nguồn gốc</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="pt-4">
          {word.definitions.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {word.definitions.map((def, index) => (
                <Button 
                  key={index}
                  variant={activeDefinition === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveDefinition(index)}
                  className="rounded-full"
                >
                  Nghĩa {index + 1}
                </Button>
              ))}
            </div>
          )}

          <h3 className="text-lg font-medium mb-3">Định nghĩa</h3>
          <div className="p-3 bg-muted/30 rounded-md mb-6">
            <p className="font-medium">{word.definitions[activeDefinition].translation}</p>
          </div>

          <h3 className="text-lg font-medium mb-3">Ví dụ câu</h3>
          <div className="space-y-4">
            {word.definitions[activeDefinition].sentence_audio.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-md overflow-hidden"
              >
                <div className="bg-muted/50 p-3 flex justify-between items-center">
                  <p className="italic">{word.definitions[activeDefinition].sentence_audio[0].key}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => playExampleAudio(word.definitions[activeDefinition].sentence_audio[0].key)}
                    className="shrink-0 ml-2"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-muted-foreground hover:text-foreground justify-start px-3 py-2"
                    onClick={() => toggleTranslation(getExampleId(activeDefinition, 0))}
                  >
                    {isTranslationVisible(getExampleId(activeDefinition, 0)) 
                      ? <ChevronUp className="h-4 w-4 mr-2" /> 
                      : <ChevronDown className="h-4 w-4 mr-2" />
                    }
                    {isTranslationVisible(getExampleId(activeDefinition, 0)) 
                      ? "Ẩn bản dịch" 
                      : "Xem bản dịch"
                    }
                  </Button>
                  
                  <AnimatePresence>
                    {isTranslationVisible(getExampleId(activeDefinition, 0)) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-3 py-2 text-muted-foreground border-t">
                          {word.definitions[activeDefinition].sentence_audio[0].trans}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {word.definitions[activeDefinition].sentence_audio.length > 1 && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpandExample(activeDefinition)}
                  className="w-full flex items-center justify-center gap-1"
                >
                  {isExampleExpanded(activeDefinition) ? (
                    <>Ẩn bớt ví dụ <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Xem thêm ví dụ <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>

                <AnimatePresence>
                  {isExampleExpanded(activeDefinition) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4 overflow-hidden"
                    >
                      {word.definitions[activeDefinition].sentence_audio.slice(1).map((item, index) => {
                        const exampleId = getExampleId(activeDefinition, index + 1);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="border rounded-md overflow-hidden"
                          >
                            <div className="bg-muted/50 p-3 flex justify-between items-center">
                              <p className="italic">{item.key}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => playExampleAudio(item.key)}
                                className="shrink-0 ml-2"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="border-t">
                              <Button 
                                variant="ghost" 
                                className="w-full text-sm text-muted-foreground hover:text-foreground justify-start px-3 py-2"
                                onClick={() => toggleTranslation(exampleId)}
                              >
                                {isTranslationVisible(exampleId) 
                                  ? <ChevronUp className="h-4 w-4 mr-2" /> 
                                  : <ChevronDown className="h-4 w-4 mr-2" />
                                }
                                {isTranslationVisible(exampleId) 
                                  ? "Ẩn bản dịch" 
                                  : "Xem bản dịch"
                                }
                              </Button>
                              
                              <AnimatePresence>
                                {isTranslationVisible(exampleId) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="px-3 py-2 text-muted-foreground border-t">
                                      {item.trans}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
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