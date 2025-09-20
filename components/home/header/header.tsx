import Image from "next/image";
import Link from "next/link";
import { AuthModals } from "./auth-modals";

interface Props {
  user: any;
}

export default function Header({ user }: Props) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      {/* Fondo con malla/grid igual que el resto de la página */}
      <div className="absolute inset-0 -z-10">
        <div className="grain-blur background-base" />
        <div className="grain-background background-base" />
        <div className="grid-bg background-base" />
        <div className="large-blur background-base" />
        <div className="small-blur background-base" />
      </div>
      
      <div className="mx-auto max-w-7xl relative px-[32px] py-6 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={"/"}>
            <Image className="w-auto block" src="/DECKapp-removebg-preview (1).png" width={180} height={54} alt="DeckAPP" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <AuthModals user={user} />
        </div>
      </div>
    </nav>
  );
}