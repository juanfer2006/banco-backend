import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.json({
    mensaje: '¡Hola Mundo desde el Backend de Banco MVP!',
    estado: 'Servidor activo',
    fecha: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
