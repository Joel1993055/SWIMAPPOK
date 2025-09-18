/**
 * Script para optimizar imágenes del directorio public
 * Convierte imágenes a WebP y AVIF para mejor rendimiento
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'];

// Función para verificar si un archivo es una imagen
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

// Función para obtener el tamaño de archivo en KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Función para analizar imágenes
function analyzeImages() {
  const files = fs.readdirSync(publicDir);
  const images = files.filter(isImageFile);
  
  console.log('📊 Análisis de imágenes en /public:');
  console.log('=====================================');
  
  let totalSize = 0;
  
  images.forEach(image => {
    const filePath = path.join(publicDir, image);
    const sizeKB = getFileSizeKB(filePath);
    totalSize += sizeKB;
    
    console.log(`📁 ${image}: ${sizeKB}KB`);
  });
  
  console.log('=====================================');
  console.log(`📈 Total: ${images.length} imágenes, ${totalSize}KB`);
  
  // Recomendaciones
  if (totalSize > 500) {
    console.log('⚠️  ADVERTENCIA: El tamaño total de imágenes es > 500KB');
    console.log('💡 Recomendación: Considera optimizar las imágenes más grandes');
  }
  
  if (images.some(img => !img.includes('webp') && !img.includes('avif'))) {
    console.log('💡 Recomendación: Considera convertir a WebP/AVIF para mejor rendimiento');
  }
  
  return { images, totalSize };
}

// Función para generar recomendaciones de optimización
function generateOptimizationRecommendations(images) {
  console.log('\n🚀 Recomendaciones de optimización:');
  console.log('=====================================');
  
  images.forEach(image => {
    const filePath = path.join(publicDir, image);
    const sizeKB = getFileSizeKB(filePath);
    
    if (sizeKB > 100) {
      console.log(`🔧 ${image} (${sizeKB}KB) - Considera comprimir`);
    }
    
    if (!image.includes('webp') && !image.includes('avif')) {
      console.log(`🖼️  ${image} - Considera convertir a WebP`);
    }
  });
  
  console.log('\n📝 Comandos útiles:');
  console.log('npm install -g imagemin-cli');
  console.log('imagemin public/*.{png,jpg,jpeg} --out-dir=public/optimized --plugin=webp');
  console.log('imagemin public/*.{png,jpg,jpeg} --out-dir=public/optimized --plugin=avif');
}

// Ejecutar análisis
if (require.main === module) {
  try {
    const { images, totalSize } = analyzeImages();
    generateOptimizationRecommendations(images);
    
    console.log('\n✅ Análisis completado');
  } catch (error) {
    console.error('❌ Error analizando imágenes:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeImages, generateOptimizationRecommendations };
