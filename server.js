// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ✅ PRIMERO: Crear la aplicación
const app = express();

// ✅ SEGUNDO: Middlewares
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos de la carpeta public

// ✅ TERCERO: Base de datos simulada
const usuarios = [];

// 🔐 Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// 📝 REGISTRO
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = {
      id: usuarios.length + 1,
      email,
      password: hashedPassword,
      role
    };

    usuarios.push(nuevoUsuario);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔑 LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 💰 TRANSFERENCIA (protegida)
app.post('/api/transferencia', verificarToken, (req, res) => {
  const { monto, cuentaDestino } = req.body;
  const usuarioId = req.usuario.id;

  if (!monto || !cuentaDestino) {
    return res.status(400).json({ error: 'Monto y cuenta destino requeridos' });
  }

  console.log(`Usuario ${usuarioId} transfiere $${monto} a cuenta ${cuentaDestino}`);
  res.json({ message: `Transferencia de $${monto} realizada correctamente` });
});

// 👤 PERFIL (protegido)
app.get('/api/perfil', verificarToken, (req, res) => {
  res.json({
    id: req.usuario.id,
    email: req.usuario.email,
    role: req.usuario.role
  });
});

// ✅ CUARTO: Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos en carpeta "public"`);
});