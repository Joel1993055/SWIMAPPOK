import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
            <CardDescription>
              Hubo un problema al procesar tu solicitud de autenticación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Esto puede deberse a:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>El enlace de confirmación ha expirado</li>
                <li>El enlace ya ha sido usado</li>
                <li>Un problema temporal del servidor</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/auth/signin">
                <Button className="w-full">Intentar de nuevo</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  Crear nueva cuenta
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
