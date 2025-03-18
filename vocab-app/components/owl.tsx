interface OwlProps {
  className?: string
}

export function Owl({ className = "w-10 h-10" }: OwlProps) {
  return (
    <div className={`${className} owl-shadow`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#58CC02" />
        <circle cx="32" cy="42" r="12" fill="white" />
        <circle cx="68" cy="42" r="12" fill="white" />
        <circle cx="32" cy="42" r="6" fill="#1CB0F6" />
        <circle cx="68" cy="42" r="6" fill="#1CB0F6" />
        <circle cx="32" cy="40" r="2" fill="white" />
        <circle cx="68" cy="40" r="2" fill="white" />
        <path d="M42 60C42 65.5228 45.5817 70 50 70C54.4183 70 58 65.5228 58 60H42Z" fill="#FF9600" />
        <path
          d="M30 30C30 25.5817 34.4772 22 40 22C45.5228 22 50 25.5817 50 30"
          stroke="#8E5800"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M50 30C50 25.5817 54.4772 22 60 22C65.5228 22 70 25.5817 70 30"
          stroke="#8E5800"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

