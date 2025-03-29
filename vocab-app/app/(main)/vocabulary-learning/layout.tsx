export default function VocabularyLearningLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        {children}
      </div>
    )
  }
  