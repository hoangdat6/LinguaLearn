import { VocabularyItem } from "@/types/lesson-types"
import { getAllVocab } from "./course-service"

const getVocabularyItems = () : VocabularyItem[] => {
  return getAllVocab()
}

const VocabularyService = {
  getVocabularyItems,
}

export default VocabularyService