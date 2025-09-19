"use client"
import { Owl } from "@/components/owl"
import { HEADER_NAV_LINKS } from "@/constants/routers"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"

export function MainNav({ pathname }: { pathname: string }) {

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Owl className="h-8 w-8" />
        <span className="font-bold hidden sm:inline-block">LinguaLearn</span>
      </Link>
      <nav className="flex items-center space-x-1">
        {[...HEADER_NAV_LINKS].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
              pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">{item.name}</span>
            {pathname === item.href && (
              <motion.div className="absolute bottom-0 left-0 h-1 w-full bg-primary" layoutId="navbar-indicator" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

