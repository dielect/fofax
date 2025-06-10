"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function FofaFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="fixed bottom-0 left-0 right-0 flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-fofa-dark/80 backdrop-blur-md text-fofa-gray-400 text-xs"
    >
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span>网络空间测绘 ©华顺信安 Version 4.9.149 京ICP备18024709号-2</span>
        <Image src="/police-badge.png" alt="Police Badge" width={16} height={16} className="inline-block" />
        <span>京公网安备11010102005893号</span>
      </div>
      <nav className="flex items-center gap-3 md:gap-4">
        {[
          { name: "社区", href: "#" },
          { name: "解决方案", href: "#" },
          { name: "数据奖励", href: "#" },
          { name: "帮助中心", href: "#" },
          { name: "关于我们", href: "#" },
          { name: "联系我们", href: "#" },
        ].map((item) => (
          <Link key={item.name} href={item.href} className="hover:text-fofa-cyan transition-colors">
            {item.name}
          </Link>
        ))}
      </nav>
    </motion.footer>
  )
}
