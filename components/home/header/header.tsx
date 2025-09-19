import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  user: any;
}

export default function Header({ user }: Props) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl relative px-[32px] py-6 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={"/"}>
            <Image className="w-auto block" src="/DECKapp-removebg-preview (1).png" width={180} height={54} alt="DeckAPP" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex space-x-4">
            {user?.id ? (
              <Button variant={"secondary"} asChild={true} size="lg" className="rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200">
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
            ) : (
              <Button asChild={true} variant={"secondary"} size="lg" className="rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 font-medium px-6 py-2.5 transition-all duration-200">
                <Link href={"/login"}>Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
