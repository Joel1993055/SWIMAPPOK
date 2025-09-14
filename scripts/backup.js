#!/usr/bin/env node

/**
 * Script de Backup Automático para Swim APP
 * Ejecutar antes de cambios importantes
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = './backups';
const CRITICAL_FILES = [
  'app/page.tsx',
  'app/dashboard-demo/page.tsx',
  'components/dashboard-demo/sidebar.tsx',
  'components/dashboard-demo/navbar.tsx',
  'components/dashboard-demo/sessions-table.tsx',
  'lib/seed.ts',
  'lib/types/session.ts',
];

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  // Crear directorio de backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  console.log(`🔄 Creando backup en: ${backupPath}`);

  // Copiar archivos críticos
  CRITICAL_FILES.forEach(file => {
    const sourcePath = path.join(process.cwd(), file);
    const destPath = path.join(backupPath, file);

    if (fs.existsSync(sourcePath)) {
      // Crear directorios si no existen
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado: ${file}`);
    } else {
      console.log(`⚠️  Archivo no encontrado: ${file}`);
    }
  });

  // Crear archivo de información del backup
  const backupInfo = {
    timestamp: new Date().toISOString(),
    description: 'Backup automático antes de cambios',
    files: CRITICAL_FILES,
    totalFiles: CRITICAL_FILES.length,
  };

  fs.writeFileSync(
    path.join(backupPath, 'backup-info.json'),
    JSON.stringify(backupInfo, null, 2)
  );

  console.log(`\n🎉 Backup completado exitosamente!`);
  console.log(`📁 Ubicación: ${backupPath}`);
  console.log(`📊 Archivos respaldados: ${backupInfo.totalFiles}`);
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('❌ No hay backups disponibles');
    return;
  }

  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter(item => fs.statSync(path.join(BACKUP_DIR, item)).isDirectory())
    .sort()
    .reverse();

  console.log('📋 Backups disponibles:');
  backups.forEach((backup, index) => {
    const backupPath = path.join(BACKUP_DIR, backup);
    const infoPath = path.join(backupPath, 'backup-info.json');

    if (fs.existsSync(infoPath)) {
      try {
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
        console.log(`${index + 1}. ${backup} - ${info.timestamp}`);
      } catch (e) {
        console.log(`${index + 1}. ${backup}`);
      }
    } else {
      console.log(`${index + 1}. ${backup}`);
    }
  });
}

// Ejecutar según argumentos
const command = process.argv[2];

switch (command) {
  case 'create':
  case undefined:
    createBackup();
    break;
  case 'list':
    listBackups();
    break;
  default:
    console.log('Uso: node scripts/backup.js [create|list]');
    console.log('  create - Crear nuevo backup (por defecto)');
    console.log('  list   - Listar backups existentes');
}
