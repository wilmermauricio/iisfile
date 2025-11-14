// Número de pipes que debe tener cada registro
const PIPES_POR_REGISTRO = 10;

/**
 * Une líneas rotas y devuelve un array con registros completos.
 * Cada elemento del array es la línea final, lista para split('|').
 */
function recomponerLineas(rawText) {
  const filas = [];
  let buffer = '';

  // Normalizamos saltos de línea y recorremos una a una
  for (const linea of rawText.replace(/\r/g, '').split('\n')) {
    if (!linea.trim()) continue;        // ignora líneas en blanco

    buffer += linea.trim();             // añade la línea al buffer
    const pipes = (buffer.match(/\|/g) || []).length;

    // ¿Ya hay suficientes pipes?  -> registro completo
    if (pipes >= PIPES_POR_REGISTRO) {
      filas.push(buffer);
      buffer = '';
    } else {
      buffer += ' ';                    // espacio opcional para que no se peguen palabras
    }
  }

  // Por si el último registro quedó justo al final
  if (buffer && (buffer.match(/\|/g) || []).length >= PIPES_POR_REGISTRO) {
    filas.push(buffer);
  }

  return filas;
}



const handleUpload = async () => {
  try {
    setUploading(true);
    setMessage('');
    setDropzoneColor('gray');

    const text = await readFileAsANSI(file);

    // 🔄 NUEVO: repara las líneas antes de procesar
    const allLines = recomponerLineas(text);

    console.log(allLines);              // ahora cada elemento tiene 10 pipes
    const linesPerChunk = 10_000;

    // Si tu archivo lleva cabecera, quítala aquí; si no, comenta la siguiente línea
    // const header = allLines[0];
    // const dataLines = allLines.slice(1);
    const dataLines = allLines;         // sin cabecera

    const totalChunks = Math.ceil(dataLines.length / linesPerChunk) || 1;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * linesPerChunk;
      const end = Math.min(start + linesPerChunk, dataLines.length);
      const chunkLines = dataLines.slice(start, end);

      // ... tu lógica de envío con TextEncoder o fetch ...
    }
  } catch (err) {
    console.error(err);
    setMessage('Error subiendo archivo');
  } finally {
    setUploading(false);
  }
};
