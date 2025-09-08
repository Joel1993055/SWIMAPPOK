import {
  BlocksIcon,
  EclipseIcon,
  FastForwardIcon,
  LanguagesIcon,
  MonitorSmartphoneIcon,
  RocketIcon,
  ScanFaceIcon,
  SquarePenIcon,
} from 'lucide-react';
import { ReactNode } from 'react';

import { Item, ItemDescription, ItemIcon, ItemTitle } from '../../ui/item';
import { Section } from '../../ui/section';

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[] | false;
  className?: string;
}

export default function Items({
  title = 'Everything coaches need for swimming analysis',
  items = [
    {
      title: 'Análisis de Tiempos Detallado',
      description:
        'Tablas completas con splits, tiempos por segmento y comparativas históricas de rendimiento',
      icon: <ScanFaceIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Planificación de Entrenamientos',
      description:
        'Herramientas para crear planes de entrenamiento personalizados con métricas específicas',
      icon: <MonitorSmartphoneIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Seguimiento de Progreso',
      description:
        'Gráficos y estadísticas que muestran la evolución del rendimiento de cada nadador',
      icon: <EclipseIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Gestión de Datos de Competición',
      description:
        'Registro y análisis de resultados de competiciones con métricas detalladas',
      icon: <BlocksIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Comparativas de Rendimiento',
      description:
        'Tablas comparativas entre nadadores, estilos y distancias para identificar fortalezas',
      icon: <FastForwardIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Reportes Automáticos',
      description:
        'Generación automática de informes detallados para cada sesión de entrenamiento',
      icon: <RocketIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Gestión de Equipos',
      description:
        'Herramientas para gestionar múltiples nadadores y organizar datos por categorías',
      icon: <LanguagesIcon className='size-5 stroke-1' />,
    },
    {
      title: 'Predicción de Rendimiento',
      description:
        'Algoritmos que predicen tiempos y sugieren mejoras basadas en datos históricos',
      icon: <SquarePenIcon className='size-5 stroke-1' />,
    },
  ],
  className,
}: ItemsProps) {
  return (
    <Section className={className}>
      <div className='max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20'>
        <h2 className='max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight'>
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <div className='grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
            {items.map((item, index) => (
              <Item key={index}>
                <ItemTitle className='flex items-center gap-2'>
                  <ItemIcon>{item.icon}</ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
