#!/usr/bin/env node

/**
 * Script para copiar archivos estáticos del frontend al directorio dist
 * Funciona en Windows, Linux y Mac
 */

const fs = require('fs');
const path = require('path');

// __dirname apunta al directorio del script (scripts/)
// ../ sube a la raíz del proyecto
const projectRoot = path.join(__dirname, '..');
const sourceDir = path.join(projectRoot, 'public');
const targetDir = path.join(projectRoot, 'dist', 'public');

function copyDirRecursive(source, target) {
  // Crear directorio de destino si no existe
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Leer contenido del directorio fuente
  const files = fs.readdirSync(source, { withFileTypes: true });

  files.forEach((file) => {
    const sourcePath = path.join(source, file.name);
    const targetPath = path.join(target, file.name);

    if (file.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

try {
  if (fs.existsSync(sourceDir)) {
    copyDirRecursive(sourceDir, targetDir);
    console.log(`✅ Archivos estáticos copiados exitosamente`);
    console.log(`   Origen: ${sourceDir}`);
    console.log(`   Destino: ${targetDir}`);
  } else {
    console.log(`⚠️  Directorio ${sourceDir} no existe. Saltando copia de archivos.`);
  }
} catch (error) {
  console.error(`❌ Error copiando archivos: ${error.message}`);
  process.exit(1);
}
