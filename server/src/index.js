const express = require('express');
const morgan = require('morgan');
const database = require('./database');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.use(cors({
    origin: ["http:/127.0.0.1:5001", "http:/127.0.0.1:5000"]
}))
app.use(morgan('dev'));
app.use(express.json())

app.get('/reservas', async (req, res) => {
    try {
        const connection = await database.getConnection();
        const result = await connection.query("SELECT * FROM reserva");
        res.json(result);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.post('/reservar', async (req, res) => {
    try {
      const { nombreApellido, fecha, invitados } = req.body;
  
      // Insertar nueva reserva
      const connection = await database.getConnection();
      const [result] = await connection.query(
        "INSERT INTO reserva (nombreApellido, fecha, invitados) VALUES (?, ?, ?)",
        [nombreApellido, fecha, invitados]
      );
  
      if (result.affectedRows === 1) {
        res.status(201).json({ mensaje: 'Reserva creada exitosamente' });
      } else {
        res.status(500).json({ mensaje: 'No se pudo crear la reserva' });
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});