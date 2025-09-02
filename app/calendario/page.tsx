import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"

export default function CalendarioPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Calendario de Entrenamientos</h2>
              <p className="text-muted-foreground">
                Planifica y organiza tus sesiones de natación
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Sesión
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Calendario */}
            <Card className="col-span-4 bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendario
                </CardTitle>
                <CardDescription>
                  Selecciona una fecha para ver o añadir entrenamientos
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Panel de información */}
            <Card className="col-span-3 bg-muted/50 border-muted">
              <CardHeader>
                <CardTitle>Información del Día</CardTitle>
                <CardDescription>
                  Detalles de los entrenamientos seleccionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Selecciona una fecha en el calendario para ver los entrenamientos
                    </p>
                  </div>
                  
                  {/* Placeholder para futuras funcionalidades */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Próximas funcionalidades:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ver entrenamientos del día seleccionado</li>
                      <li>• Añadir nuevos entrenamientos</li>
                      <li>• Editar entrenamientos existentes</li>
                      <li>• Vista mensual de entrenamientos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
