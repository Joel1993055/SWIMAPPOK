"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { SignInDialog } from "@/components/auth/signin-dialog"
import { SignUpDialog } from "@/components/auth/signup-dialog"

export function LandingHeader() {
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  const handleSignInClick = () => {
    setSignInOpen(true)
  }

  const handleSignUpClick = () => {
    setSignUpOpen(true)
  }

  const handleSwitchToSignUp = () => {
    setSignInOpen(false)
    setSignUpOpen(true)
  }

  const handleSwitchToSignIn = () => {
    setSignUpOpen(false)
    setSignInOpen(true)
  }

  return (
    <>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-gray-200"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Dialogs */}
      <SignInDialog 
        open={signInOpen} 
        onOpenChange={setSignInOpen}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </>
  )
}
