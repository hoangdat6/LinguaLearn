interface OwlProps {
    className?: string
}


// logo con cú
export function Owl2({ className = "w-10 h-10" }: OwlProps) {
    return (
        <div className={`${className} owl-shadow`}>     
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#cceeff" />
                        <stop offset="100%" stopColor="#66b2ff" />
                    </radialGradient>
                </defs>
                <circle cx="512" cy="512" r="500" fill="url(#bgGrad)" />

                {/* Made the owl larger with scale transform */}
                <g transform="translate(262, 200) scale(1.5)">
                    <ellipse cx="150" cy="200" rx="110" ry="140" fill="#a86e3c" />
                    <ellipse cx="150" cy="220" rx="70" ry="100" fill="#f9f3e8" />

                    <circle cx="110" cy="150" r="30" fill="white" />
                    <circle cx="110" cy="150" r="12" fill="black" />

                    <circle cx="190" cy="150" r="30" fill="white" />
                    <circle cx="190" cy="150" r="12" fill="black" />

                    <circle cx="110" cy="150" r="40" fill="none" stroke="black" strokeWidth="3" />
                    <circle cx="190" cy="150" r="40" fill="none" stroke="black" strokeWidth="3" />
                    <line x1="150" y1="150" x2="150" y2="170" stroke="black" strokeWidth="3" />

                    <polygon points="150,170 140,190 160,190" fill="#ffc107" />

                    <line x1="120" y1="330" x2="120" y2="350" stroke="#444" strokeWidth="6" />
                    <line x1="180" y1="330" x2="180" y2="350" stroke="#444" strokeWidth="6" />
                </g>

                <g>
                    <rect x="410" y="680" width="200" height="35" rx="8" fill="white" stroke="#ccc" strokeWidth="2" />
                    <line x1="410" y1="698" x2="610" y2="698" stroke="#ddd" strokeWidth="2" />
                </g>

                <rect x="820" y="820" width="80" height="50" fill="#00247d" />
                <line x1="820" y1="820" x2="900" y2="870" stroke="white" strokeWidth="6" />
                <line x1="820" y1="870" x2="900" y2="820" stroke="white" strokeWidth="6" />
                <rect x="850" y="840" width="20" height="10" fill="white" />
                <rect x="860" y="830" width="10" height="30" fill="white" />
            </svg>
        </div>
    )
}