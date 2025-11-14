import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropzoneTxtParser() {
  const [records, setRecords] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const cleanRecords = parseRecords(text);
      setRecords(cleanRecords);
    };

    reader.readAsText(file);
  }, []);

  const parseRecords = (text) => {
    const normalizedText = text.replace(/\r/g, '').split('\n').join('');
    const rawFields = normalizedText.split('|');

    const result = [];
    for (let i = 0; i < rawFields.length; i += 10) {
      const slice = rawFields.slice(i, i + 10);
      if (slice.length === 10) result.push(slice);
    }
    return result;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
          isDragActive ? 'bg-blue-100' : 'bg-gray-100'
        }`}
      >
        <input {...getInputProps()} accept=".txt" />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>Arrastra un archivo .txt aquí, o haz clic para seleccionar uno</p>
        )}
      </div>

      {records.length > 0 && (
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm mt-6">
          <thead>
            <tr>
              <th className="border px-2 py-1">RNC</th>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Comercial</th>
              <th className="border px-2 py-1">Actividad</th>
              <th className="border px-2 py-1">Campo 5</th>
              <th className="border px-2 py-1">Campo 6</th>
              <th className="border px-2 py-1">Campo 7</th>
              <th className="border px-2 py-1">Campo 8</th>
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, idx) => (
              <tr key={idx}>
                {row.map((field, i) => (
                  <td key={i} className="border px-2 py-1">{field}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
