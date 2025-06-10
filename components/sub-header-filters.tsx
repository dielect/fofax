"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const relatedIconsData = [
  { src: "/related-icons/icon1.png", alt: "Icon 1", count: "999+" },
  { src: "/related-icons/icon2.png", alt: "Icon 2", count: "999+" },
  { src: "/related-icons/icon3.png", alt: "Icon 3", count: "360" },
  { src: "/related-icons/icon4.png", alt: "Icon 4", count: "351" },
  { src: "/related-icons/icon5.png", alt: "Icon 5", count: "317" },
  // Add more icons as needed from the screenshot
]

export default function SubHeaderFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="px-4 py-2 bg-fofa-dark border-b border-slate-700/50 flex items-center gap-4 text-sm text-fofa-gray-300"
    >
      <span>相关icon(10):</span>
      <div className="flex items-center gap-2 overflow-x-auto">
        {relatedIconsData.map((icon, index) => (
          <div key={index} className="relative shrink-0">
            <Avatar className="h-7 w-7 rounded-sm border border-slate-600">
              <AvatarImage src={icon.src || "/placeholder.svg"} alt={icon.alt} />
              <AvatarFallback className="bg-slate-700 text-xs">{icon.alt.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <Badge className="absolute -top-1.5 -right-2.5 text-xs px-1 py-0.5 bg-fofa-cyan text-fofa-dark rounded-sm">
              {icon.count}
            </Badge>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto border-fofa-cyan/50 text-fofa-cyan hover:bg-fofa-cyan/10 hover:text-fofa-cyan"
      >
        更多
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-fofa-cyan/50 text-fofa-cyan hover:bg-fofa-cyan/10 hover:text-fofa-cyan"
      >
        全选
      </Button>
    </motion.div>
  )
}
