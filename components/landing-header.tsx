"use client"

import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"

export function LandingHeader() {
  return (
    <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Swim:APP</span>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex gap-3">
            <AuthDialog
              mode="signin"
              trigger={
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black">
                  Sign In
                </Button>
              }
            />
            <AuthDialog
              mode="signup"
              trigger={
                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                  Sign Up
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}
