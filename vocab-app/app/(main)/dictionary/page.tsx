"use client"

import { DictionaryTrendingWords } from "@/components/dictionary/trending-words"
import { DictionaryWordDetails } from "@/components/dictionary/word-details"
import { DictionaryWordOfDay } from "@/components/dictionary/word-of-day"
import SearchLoading from "@/components/dictionary/search-loading"
import { useDictionary } from "@/hooks/use-dictionary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowRight, ChevronRight, History, Search, Sparkles, TrendingUp, X } from 'lucide-react'

export default function DictionaryPage() {
  const {
    searchTerm,
    selectedWord,
    isLoading,
    showSuggestions,
    recentSearches,
    setRecentSearches,
    savedWords,
    suggestions,
    searchInputRef,
    handleSearch,
    toggleSavedWord,
    clearSearch,
    handleKeyPress,
    handleInputChange,
    error
  } = useDictionary()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 container py-6 px-3 md:px-8">
        <div className="mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Từ điển</h1>
            <p className="text-muted-foreground">Tra cứu từ vựng, nghĩa và cách sử dụng</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="overflow-hidden border-2">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="flex items-center p-4 border-b">
                      <Search className="absolute left-6 text-muted-foreground h-5 w-5" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Nhập từ cần tra cứu..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={clearSearch}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleSearch()}
                        disabled={!searchTerm.trim() || isLoading}
                        className="ml-2"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          "Tìm kiếm"
                        )}
                      </Button>
                    </div>

                    {/* Search suggestions */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 left-0 right-0 bg-background border-t shadow-md"
                        >
                          <ul className="py-2">
                            {suggestions.map((suggestion) => (
                              <li key={suggestion}>
                                <button
                                  className="w-full px-4 py-2 text-left hover:bg-muted flex items-center"
                                  onClick={() => {
                                    handleSearch(suggestion)
                                  }}
                                >
                                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {suggestion}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6 space-y-4"
                        >
                          <SearchLoading />
                        </motion.div>
                      ) : error ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6"
                        >
                          <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                            <h3 className="text-lg font-medium mb-2">Không tìm thấy từ</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              {error}
                            </p>
                            {suggestions.length > 0 && (
                              <div className="mt-6">
                                <p className="text-sm font-medium mb-2">Có thể bạn muốn tìm:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {suggestions.slice(0, 5).map((suggestion) => (
                                    <Badge
                                      key={suggestion}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-muted"
                                      onClick={() => handleSearch(suggestion)}
                                    >
                                      {suggestion}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : selectedWord ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DictionaryWordDetails
                            word={selectedWord}
                            isSaved={savedWords.includes(selectedWord.word)}
                            onToggleSave={() => toggleSavedWord(selectedWord.word)}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-6"
                        >
                          <div className="text-center py-12">
                            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Tìm kiếm từ vựng</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Nhập từ vựng bạn muốn tra cứu vào ô tìm kiếm phía trên để xem định nghĩa, ví dụ và cách phát âm.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {recentSearches.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <History className="h-5 w-5 mr-2 text-muted-foreground" />
                        Tìm kiếm gần đây
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRecentSearches([])}
                      >
                        Xóa lịch sử
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <Badge
                          key={term}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleSearch(term)}
                        >
                          {term}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <DictionaryWordOfDay onSelectWord={(word) => handleSearch(word)} />

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
                    Từ vựng thịnh hành
                  </h3>
                  <DictionaryTrendingWords onSelectWord={(word) => handleSearch(word)} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <Sparkles className="h-5 w-5 mr-2 text-muted-foreground" />
                    Mẹo học từ vựng
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                      <span>Sử dụng từ trong câu để hiểu ngữ cảnh</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                      <span>Tìm hiểu từ đồng nghĩa và trái nghĩa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                      <span>Lưu từ mới và ôn tập thường xuyên</span>
                    </li>
                  </ul>
                  <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                    Xem thêm mẹo học từ vựng
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

