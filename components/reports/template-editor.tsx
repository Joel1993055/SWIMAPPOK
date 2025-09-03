"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Copy,
  Layout,
  BarChart3,
  Calendar,
  Target,
  FileText,
  Image,
  Table
} from "lucide-react";

interface TemplateElement {
  id: string;
  type: 'header' | 'chart' | 'table' | 'text' | 'image' | 'kpi' | 'calendar';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, unknown>;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'planning' | 'training' | 'team' | 'custom';
  userType: 'coach' | 'swimmer' | 'admin' | 'all';
  season: 'preparation' | 'competition' | 'recovery' | 'all';
  elements: TemplateElement[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState<string>("");
  const [templateUserType, setTemplateUserType] = useState<string>("");
  const [templateSeason, setTemplateSeason] = useState<string>("");
  const [templateElements, setTemplateElements] = useState<TemplateElement[]>([]);

  // Plantillas predefinidas
  const defaultTemplates: ReportTemplate[] = [
    {
      id: "perf-coach-prep",
      name: "Reporte de Rendimiento - Entrenador",
      description: "Análisis completo de rendimiento para entrenadores en fase de preparación",
      category: "performance",
      userType: "coach",
      season: "preparation",
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: "header-1",
          type: "header",
          title: "Reporte de Rendimiento",
          content: "Análisis de rendimiento del equipo",
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: "center", color: "#1f2937" }
        },
        {
          id: "kpi-1",
          type: "kpi",
          title: "KPIs Principales",
          content: "Métricas clave del rendimiento",
          position: { x: 0, y: 2 },
          size: { width: 6, height: 4 },
          config: { metrics: ["distancia", "tiempo", "intensidad", "frecuencia"] }
        },
        {
          id: "chart-1",
          type: "chart",
          title: "Evolución del Rendimiento",
          content: "Gráfico de progreso temporal",
          position: { x: 6, y: 2 },
          size: { width: 6, height: 4 },
          config: { chartType: "line", dataSource: "performance" }
        },
        {
          id: "table-1",
          type: "table",
          title: "Comparativa de Nadadores",
          content: "Tabla comparativa de resultados",
          position: { x: 0, y: 6 },
          size: { width: 12, height: 4 },
          config: { columns: ["nombre", "tiempo", "mejora", "categoria"] }
        }
      ]
    },
    {
      id: "plan-team-comp",
      name: "Planificación de Equipo - Competición",
      description: "Planificación detallada para competiciones importantes",
      category: "planning",
      userType: "coach",
      season: "competition",
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: "header-2",
          type: "header",
          title: "Planificación de Competición",
          content: "Estrategia y preparación para competición",
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: "center", color: "#dc2626" }
        },
        {
          id: "calendar-1",
          type: "calendar",
          title: "Cronograma de Entrenamientos",
          content: "Calendario de preparación",
          position: { x: 0, y: 2 },
          size: { width: 8, height: 6 },
          config: { view: "month", showTraining: true }
        },
        {
          id: "kpi-2",
          type: "kpi",
          title: "Objetivos de Competición",
          content: "Metas y objetivos específicos",
          position: { x: 8, y: 2 },
          size: { width: 4, height: 6 },
          config: { metrics: ["objetivo", "progreso", "dias_restantes"] }
        }
      ]
    },
    {
      id: "train-swimmer",
      name: "Entrenamientos - Nadador",
      description: "Resumen personal de entrenamientos para nadadores",
      category: "training",
      userType: "swimmer",
      season: "all",
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [
        {
          id: "header-3",
          type: "header",
          title: "Mis Entrenamientos",
          content: "Resumen personal de entrenamientos",
          position: { x: 0, y: 0 },
          size: { width: 12, height: 2 },
          config: { fontSize: 24, alignment: "center", color: "#059669" }
        },
        {
          id: "chart-2",
          type: "chart",
          title: "Progreso Personal",
          content: "Evolución de mi rendimiento",
          position: { x: 0, y: 2 },
          size: { width: 8, height: 4 },
          config: { chartType: "area", dataSource: "personal" }
        },
        {
          id: "kpi-3",
          type: "kpi",
          title: "Mis Estadísticas",
          content: "Métricas personales",
          position: { x: 8, y: 2 },
          size: { width: 4, height: 4 },
          config: { metrics: ["total_metros", "sesiones", "mejor_tiempo"] }
        },
        {
          id: "table-2",
          type: "table",
          title: "Últimos Entrenamientos",
          content: "Historial reciente",
          position: { x: 0, y: 6 },
          size: { width: 12, height: 4 },
          config: { columns: ["fecha", "tipo", "distancia", "tiempo", "notas"] }
        }
      ]
    }
  ];

  const [templates, setTemplates] = useState<ReportTemplate[]>(defaultTemplates);

  const elementTypes = [
    { type: 'header', label: 'Encabezado', icon: FileText, description: 'Título o encabezado del reporte' },
    { type: 'chart', label: 'Gráfico', icon: BarChart3, description: 'Gráficos de datos y estadísticas' },
    { type: 'table', label: 'Tabla', icon: Table, description: 'Tablas de datos estructurados' },
    { type: 'kpi', label: 'KPI', icon: Target, description: 'Métricas clave y indicadores' },
    { type: 'calendar', label: 'Calendario', icon: Calendar, description: 'Vista de calendario y eventos' },
    { type: 'text', label: 'Texto', icon: FileText, description: 'Bloques de texto libre' },
    { type: 'image', label: 'Imagen', icon: Image, description: 'Imágenes y logos' }
  ];

  const handleCreateTemplate = () => {
    setIsEditing(true);
    setSelectedTemplate(null);
    setTemplateName("");
    setTemplateDescription("");
    setTemplateCategory("");
    setTemplateUserType("");
    setTemplateSeason("");
    setTemplateElements([]);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateCategory(template.category);
    setTemplateUserType(template.userType);
    setTemplateSeason(template.season);
    setTemplateElements([...template.elements]);
  };

  const handleSaveTemplate = () => {
    const newTemplate: ReportTemplate = {
      id: selectedTemplate?.id || `template-${Date.now()}`,
      name: templateName,
      description: templateDescription,
      category: templateCategory as 'performance' | 'planning' | 'training' | 'team' | 'custom',
      userType: templateUserType as 'coach' | 'swimmer' | 'admin' | 'all',
      season: templateSeason as 'preparation' | 'competition' | 'recovery' | 'all',
      elements: templateElements,
      isDefault: false,
      createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? newTemplate : t));
    } else {
      setTemplates(prev => [...prev, newTemplate]);
    }

    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleAddElement = (elementType: string) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type: elementType as 'header' | 'chart' | 'table' | 'text' | 'image' | 'kpi' | 'calendar',
      title: `Nuevo ${elementType}`,
      content: `Contenido del ${elementType}`,
      position: { x: 0, y: templateElements.length * 2 },
      size: { width: 6, height: 3 },
      config: {}
    };

    setTemplateElements(prev => [...prev, newElement]);
  };

  const handleDeleteElement = (elementId: string) => {
    setTemplateElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const duplicatedTemplate: ReportTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Editor de Plantillas</h2>
          <p className="text-muted-foreground">
            Crea y personaliza plantillas de reportes para diferentes usuarios y temporadas
          </p>
        </div>
        <Button onClick={handleCreateTemplate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="editor" disabled={!isEditing}>Editor</TabsTrigger>
          <TabsTrigger value="preview" disabled={!isEditing}>Vista Previa</TabsTrigger>
        </TabsList>

        {/* Lista de plantillas */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="bg-muted/50 border-muted">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                    {template.isDefault && (
                      <Badge variant="secondary">Predefinida</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant="outline">{template.userType}</Badge>
                    <Badge variant="outline">{template.season}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layout className="h-4 w-4" />
                    {template.elements.length} elementos
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {!template.isDefault && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Editor de plantillas */}
        <TabsContent value="editor" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Panel de configuración */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-muted/50 border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la plantilla</Label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Mi plantilla personalizada"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Descripción</Label>
                    <Textarea
                      id="template-description"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="Describe el propósito de esta plantilla"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Categoría</Label>
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Rendimiento</SelectItem>
                          <SelectItem value="planning">Planificación</SelectItem>
                          <SelectItem value="training">Entrenamiento</SelectItem>
                          <SelectItem value="team">Equipo</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-user">Tipo de usuario</Label>
                      <Select value={templateUserType} onValueChange={setTemplateUserType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coach">Entrenador</SelectItem>
                          <SelectItem value="swimmer">Nadador</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-season">Temporada</Label>
                    <Select value={templateSeason} onValueChange={setTemplateSeason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Preparación</SelectItem>
                        <SelectItem value="competition">Competición</SelectItem>
                        <SelectItem value="recovery">Recuperación</SelectItem>
                        <SelectItem value="all">Todas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveTemplate} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Elementos disponibles */}
              <Card className="bg-muted/50 border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Elementos</CardTitle>
                  <CardDescription>
                    Arrastra elementos al editor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {elementTypes.map((element) => {
                    const Icon = element.icon;
                    return (
                      <Button
                        key={element.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => handleAddElement(element.type)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">{element.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {element.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Editor visual */}
            <div className="lg:col-span-2">
              <Card className="bg-muted/50 border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Editor Visual</CardTitle>
                  <CardDescription>
                    Diseña tu plantilla arrastrando elementos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    {templateElements.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Arrastra elementos aquí para crear tu plantilla</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-12 gap-4">
                        {templateElements.map((element) => {
                          const Icon = elementTypes.find(et => et.type === element.type)?.icon || FileText;
                          return (
                            <div
                              key={element.id}
                              className={`col-span-${element.size.width} row-span-${element.size.height} border border-muted-foreground/25 rounded-lg p-3 bg-background/50 relative group`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium text-sm">{element.title}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  onClick={() => handleDeleteElement(element.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {element.content}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Vista previa */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
              <CardDescription>
                Así se verá tu reporte con datos reales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[600px] bg-white rounded-lg p-6 shadow-sm">
                {templateElements.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Agrega elementos para ver la vista previa</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templateElements.map((element) => {
                      const Icon = elementTypes.find(et => et.type === element.type)?.icon || FileText;
                      return (
                        <div
                          key={element.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{element.title}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {element.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
