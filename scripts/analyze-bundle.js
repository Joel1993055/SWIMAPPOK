const { exec, spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// =====================================================
// CONFIGURACIÓN
// =====================================================

const BUNDLE_REPORT_DIR = path.join(process.cwd(), '.bundle-reports');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_FILE = path.join(BUNDLE_REPORT_DIR, `bundle-report-${TIMESTAMP}.json`);

// =====================================================
// UTILIDADES
// =====================================================

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function printBundleStats(stats) {
  console.log('\n📊 Bundle Statistics:');
  console.log('=' .repeat(50));
  
  if (stats.assets) {
    console.log('\n📦 Largest Assets:');
    const sortedAssets = stats.assets
      .filter(asset => asset.size > 10000) // Solo mostrar assets > 10KB
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    sortedAssets.forEach(asset => {
      console.log(`  ${asset.name}: ${formatBytes(asset.size)}`);
    });
  }
  
  if (stats.chunks) {
    console.log('\n🧩 Chunks:');
    const sortedChunks = stats.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    sortedChunks.forEach(chunk => {
      console.log(`  ${chunk.names.join(', ') || chunk.id}: ${formatBytes(chunk.size)}`);
    });
  }
  
  console.log('\n' + '=' .repeat(50));
}

function generateRecommendations(bundleSize, largeFiles) {
  const recommendations = [];
  
  // Recomendaciones basadas en el tamaño total
  if (bundleSize > 5 * 1024 * 1024) { // > 5MB
    recommendations.push({
      type: 'warning',
      title: 'Large Bundle Size',
      description: `Total bundle size is ${formatBytes(bundleSize)}. Consider implementing code splitting and lazy loading.`,
      priority: 'high'
    });
  } else if (bundleSize > 2 * 1024 * 1024) { // > 2MB
    recommendations.push({
      type: 'info',
      title: 'Moderate Bundle Size',
      description: `Bundle size is ${formatBytes(bundleSize)}. Monitor growth and consider optimization techniques.`,
      priority: 'medium'
    });
  }
  
  // Recomendaciones basadas en archivos grandes
  if (largeFiles.length > 0) {
    const veryLargeFiles = largeFiles.filter(file => file.size > 500 * 1024); // > 500KB
    
    if (veryLargeFiles.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Very Large Files Detected',
        description: `Found ${veryLargeFiles.length} files larger than 500KB. Consider code splitting.`,
        files: veryLargeFiles.map(file => ({ name: file.name, size: formatBytes(file.size) })),
        priority: 'high'
      });
    }
    
    const jsFiles = largeFiles.filter(file => file.name.endsWith('.js'));
    if (jsFiles.length > 5) {
      recommendations.push({
        type: 'info',
        title: 'Many JavaScript Files',
        description: `Found ${jsFiles.length} large JavaScript files. Consider consolidating or lazy loading.`,
        priority: 'medium'
      });
    }
  }
  
  // Recomendaciones específicas para Next.js
  recommendations.push({
    type: 'tip',
    title: 'Next.js Optimization Tips',
    description: 'Use dynamic imports, optimize images with next/image, and enable compression.',
    priority: 'low'
  });
  
  return recommendations;
}

// =====================================================
// ANÁLISIS DE ARCHIVOS
// =====================================================

function analyzeFiles() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('⚠️  Static directory not found. Make sure the project is built.');
    return { totalSize: 0, largeFiles: [] };
  }
  
  const largeFiles = [];
  
  const getDirSize = (dir, prefix = '') => {
    let size = 0;
    
    if (!fs.existsSync(dir)) return size;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += getDirSize(filePath, `${prefix}${file}/`);
      } else {
        size += stat.size;
        
        // Registrar archivos grandes
        if (stat.size > 100 * 1024) { // > 100KB
          largeFiles.push({
            name: `${prefix}${file}`,
            size: stat.size,
            path: filePath
          });
        }
      }
    }
    
    return size;
  };
  
  const totalSize = getDirSize(staticDir);
  
  return { totalSize, largeFiles };
}

// =====================================================
// ANÁLISIS PRINCIPAL
// =====================================================

async function analyzeBundleSize() {
  console.log('🔍 Starting bundle analysis...\n');
  
  // Asegurar que existe el directorio de reportes
  ensureDirectoryExists(BUNDLE_REPORT_DIR);
  
  // 1. Build normal
  console.log('📦 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    throw error;
  }
  
  // 2. Analizar archivos generados
  console.log('📊 Analyzing generated files...');
  const { totalSize, largeFiles } = analyzeFiles();
  
  console.log(`📈 Total bundle size: ${formatBytes(totalSize)}`);
  
  if (largeFiles.length > 0) {
    console.log(`\n📦 Large files (>100KB):`);
    largeFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .forEach(file => {
        console.log(`  ${file.name}: ${formatBytes(file.size)}`);
      });
  }
  
  // 3. Build con análisis detallado
  console.log('\n🔍 Running detailed analysis...');
  try {
    execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
    console.log('✅ Detailed analysis completed\n');
  } catch (error) {
    console.log('⚠️  Detailed analysis failed, continuing with basic analysis...');
  }
  
  // 4. Generar reporte
  const recommendations = generateRecommendations(totalSize, largeFiles);
  
  const report = {
    timestamp: new Date().toISOString(),
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    largeFiles: largeFiles.map(file => ({
      name: file.name,
      size: file.size,
      sizeFormatted: formatBytes(file.size)
    })),
    recommendations,
    buildInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd()
    }
  };
  
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved to: ${REPORT_FILE}`);
  
  // 5. Mostrar recomendaciones
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('=' .repeat(50));
    
    const sortedRecs = recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
    
    sortedRecs.forEach((rec, index) => {
      const priorityEmoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`\n${index + 1}. ${priorityEmoji} ${rec.title}`);
      console.log(`   ${rec.description}`);
      
      if (rec.files) {
        rec.files.forEach(file => {
          console.log(`   - ${file.name}: ${file.size}`);
        });
      }
    });
  }
  
  return report;
}

// =====================================================
// ANÁLISIS COMPARATIVO
// =====================================================

function compareWithPreviousReport(currentReport) {
  const reportFiles = fs.readdirSync(BUNDLE_REPORT_DIR)
    .filter(file => file.startsWith('bundle-report-'))
    .sort()
    .reverse();
  
  if (reportFiles.length < 2) {
    console.log('\n📈 No previous report found for comparison.');
    return;
  }
  
  try {
    const previousReport = JSON.parse(fs.readFileSync(
      path.join(BUNDLE_REPORT_DIR, reportFiles[1]), 'utf8'
    ));
    
    console.log('\n📈 Comparison with previous build:');
    console.log('=' .repeat(50));
    
    // Comparar tamaño total
    const diff = currentReport.totalSize - previousReport.totalSize;
    const diffPercent = previousReport.totalSize > 0 
      ? ((diff / previousReport.totalSize) * 100).toFixed(2)
      : '0.00';
    
    const diffEmoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
    const diffSign = diff >= 0 ? '+' : '';
    
    console.log(`${diffEmoji} Total bundle size: ${currentReport.totalSizeFormatted} (${diffSign}${formatBytes(diff)}, ${diffSign}${diffPercent}%)`);
    
    // Comparar número de archivos grandes
    const currentLargeCount = currentReport.largeFiles.length;
    const previousLargeCount = previousReport.largeFiles.length;
    const filesDiff = currentLargeCount - previousLargeCount;
    
    if (filesDiff !== 0) {
      const filesEmoji = filesDiff > 0 ? '📈' : '📉';
      console.log(`${filesEmoji} Large files: ${currentLargeCount} (${filesDiff >= 0 ? '+' : ''}${filesDiff})`);
    }
    
  } catch (error) {
    console.log('⚠️  Could not compare with previous report.');
  }
}

// =====================================================
// LIMPIEZA DE REPORTES ANTIGUOS
// =====================================================

function cleanupOldReports() {
  const reportFiles = fs.readdirSync(BUNDLE_REPORT_DIR)
    .filter(file => file.startsWith('bundle-report-'))
    .sort();
  
  // Mantener solo los últimos 10 reportes
  if (reportFiles.length > 10) {
    const filesToDelete = reportFiles.slice(0, reportFiles.length - 10);
    filesToDelete.forEach(file => {
      fs.unlinkSync(path.join(BUNDLE_REPORT_DIR, file));
    });
    console.log(`🧹 Cleaned up ${filesToDelete.length} old reports.`);
  }
}

// =====================================================
// EJECUCIÓN PRINCIPAL
// =====================================================

async function main() {
  try {
    const report = await analyzeBundleSize();
    compareWithPreviousReport(report);
    cleanupOldReports();
    
    console.log('\n🎉 Bundle analysis completed!');
    console.log('📊 Check your browser for the detailed interactive report (if available).');
    console.log(`📄 Detailed report saved to: ${REPORT_FILE}`);
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  formatBytes,
  generateRecommendations,
  analyzeFiles
};