import { SessionsTable } from '@/components/features/dashboard/sessions-table';
import { BookOpenIcon } from 'lucide-react';

export default function LogPage() {
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BookOpenIcon className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>
            Training Log
          </h1>
        </div>
        <p className='text-muted-foreground'>
          Historial completo de tus sesiones de natación
        </p>
      </div>
      <SessionsTable />
    </div>
  );
}
