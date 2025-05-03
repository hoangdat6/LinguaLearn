import { Suspense } from "react"

export default function VocabularyLearningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className=" bg-background overflow-x-hidden">
        {children}
      </div>
  )
}
