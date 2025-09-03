// Script de prueba para verificar la conexión con Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verificando configuración...');
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada');

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('🧪 Probando conexión...');
  
  // Probar conexión básica
  supabase
    .from('sessions')
    .select('count')
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Error de conexión:', error.message);
      } else {
        console.log('✅ Conexión exitosa!');
        console.log('📊 Tabla sessions accesible');
      }
    })
    .catch(err => {
      console.log('❌ Error:', err.message);
    });
} else {
  console.log('❌ Variables de entorno no configuradas');
}
