const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function diagnoseSupabase() {
  console.log(' Diagnóstico de Supabase...\n');

  // 1. Verificar variables de entorno
  console.log('1. Verificando variables de entorno:');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL no está definida');
    return;
  }
  if (!anonKey) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
    return;
  }
  
  console.log('✅ Variables de entorno encontradas');
  console.log(`   URL: ${url.substring(0, 30)}...`);
  console.log(`   Key: ${anonKey.substring(0, 20)}...\n`);

  // 2. Crear cliente Supabase
  console.log('2. Creando cliente Supabase...');
  const supabase = createClient(url, anonKey);
  console.log('✅ Cliente creado exitosamente\n');

  // 3. Probar conexión básica
  console.log('3. Probando conexión básica...');
  try {
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    if (error) {
      console.log('⚠️  Error en consulta de migraciones:', error.message);
    } else {
      console.log('✅ Conexión básica exitosa');
    }
  } catch (err) {
    console.log('❌ Error de conexión:', err.message);
  }

  // 4. Probar autenticación
  console.log('\n4. Probando sistema de autenticación...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.log('⚠️  Error obteniendo usuario:', error.message);
    } else if (user) {
      console.log('✅ Usuario autenticado:', user.email);
    } else {
      console.log('ℹ️  No hay usuario autenticado (esto es normal)');
    }
  } catch (err) {
    console.log('❌ Error de autenticación:', err.message);
  }

  // 5. Verificar configuración de la base de datos
  console.log('\n5. Verificando configuración de la base de datos...');
  try {
    // Intentar acceder a una tabla que debería existir
    const { data, error } = await supabase
      .from('sessions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Error accediendo a tabla sessions:', error.message);
      console.log('   Esto puede indicar que las tablas no están creadas');
    } else {
      console.log('✅ Tabla sessions accesible');
    }
  } catch (err) {
    console.log('❌ Error verificando base de datos:', err.message);
  }

  console.log('\n🏁 Diagnóstico completado');
}

diagnoseSupabase().catch(console.error);
```

Ahora, para diagnosticar el problema específico, necesito que ejecutes este comando en tu terminal:

```bash
node scripts/diagnose-supabase.js
```

Pero antes, déjame verificar si hay algún problema específico que pueda estar causando el fallo. Basándome en lo que veo en tu configuración, hay algunas posibles causas:

## Posibles problemas identificados:

### 1. **Problema de configuración de URL de Supabase**
Veo que tu URL de Supabase parece estar truncada en la imagen: `https://htxyugbuhduocnrkicns.su`. Esto sugiere que la URL podría estar incompleta.

### 2. **Problema de configuración de la base de datos**
Tu aplicación espera ciertas tablas (como `sessions`) que podrían no estar creadas en tu proyecto de Supabase.

### 3. **Problema de configuración de autenticación**
Las políticas RLS (Row Level Security) podrían no estar configuradas correctamente.

## Soluciones paso a paso:

### **Paso 1: Verificar la URL completa de Supabase**
Asegúrate de que tu `NEXT_PUBLIC_SUPABASE_URL` sea completa. Debería verse así:
```
https://tu-proyecto-id.supabase.co
```

### **Paso 2: Verificar que las tablas estén creadas**
Ve a tu proyecto de Supabase → SQL Editor y ejecuta el script de la base de datos que tienes en `database/supabase-schema.sql`.

### **Paso 3: Verificar la configuración de autenticación**
Ve a Authentication → Settings en tu proyecto de Supabase y asegúrate de que:
- Site URL esté configurada como `http://localhost:3000` (para desarrollo)
- Redirect URLs incluya `http://localhost:3000/auth/callback`

¿Puedes verificar estos puntos y decirme qué encuentras? Especialmente la URL completa de Supabase y si has ejecutado los scripts de la base de datos.
