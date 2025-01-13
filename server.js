const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

// Middleware para CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a la base de datos MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => console.log("Conectado a la base de datos MySQL"))
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

// Crear router API
const apiRouter = express.Router();

// Rutas de usuarios

// Crear un nuevo usuario
apiRouter.post("/users", async (req, res) => {
  const { username, password_hash, email, full_name, role, is_active } =
    req.body;
  const query = `
    INSERT INTO users 
    (username, password_hash, email, full_name, role, is_active) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [results] = await db.execute(query, [
      username,
      password_hash,
      email,
      full_name,
      role,
      is_active || 1,
    ]);
    res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: results.insertId,
    });
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});
// Modificar esta ruta para mantener consistencia
apiRouter.get("/users", async (req, res) => {
  const query = "SELECT * FROM users";
  try {
    const [results] = await db.execute(query);
    console.log("Usuarios encontrados:", results);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// Rutas de bienes

// Obtener todos los bienes
apiRouter.get("/bienes", async (req, res) => {
  const query = "SELECT * FROM bienes";
  try {
    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener los bienes:", err);
    res.status(500).json({ error: "Error al obtener los bienes" });
  }
});

// Crear un nuevo bien
apiRouter.post("/bienes", async (req, res) => {
  const {
    name,
    description,
    category_id,
    institutional_code,
    senescyt_code,
    barcode,
    model,
    status,
    area_id,
    notes,
    class_of_good,
    brand,
    purchase_date,
    purchase_value,
    current_value,
    institutional_responsible,
  } = req.body;

  const connection = await db.getConnection(); // Usa una conexión para manejar transacciones

  try {
    // Inicia una transacción
    await connection.beginTransaction();

    // Inserta el bien en la tabla principal
    const queryAsset = `
  INSERT INTO bienes 
  (name, description, category_id, institutional_code, senescyt_code, barcode, model, status, area_id, notes, brand, purchase_date, purchase_value, current_value)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const [assetResult] = await connection.execute(queryAsset, [
      name,
      description,
      category_id,
      institutional_code,
      senescyt_code,
      barcode,
      model,
      status,
      area_id,
      notes,
      brand,
      purchase_date,
      purchase_value,
      current_value,
    ]);

    // Obtén el ID del bien recién creado
    const assetId = assetResult.insertId;

    // Inserta los responsables en la tabla bienes_responsables
    if (
      Array.isArray(institutional_responsible) &&
      institutional_responsible.length > 0
    ) {
      const values = institutional_responsible
        .map(({ user_id }) => `(${assetId}, ${user_id})`)
        .join(", ");

      const queryResponsibles = `
        INSERT INTO bienes_responsables (asset_id, user_id) 
        VALUES ${values}
      `;
      await connection.execute(queryResponsibles);
    }

    // Confirma la transacción
    await connection.commit();

    res.status(201).json({ message: "Bien creado exitosamente", assetId });
  } catch (err) {
    // Si ocurre un error, deshaz la transacción
    await connection.rollback();
    console.error("Error al crear el bien:", err);
    res.status(500).json({ error: "Error al crear el bien" });
  } finally {
    // Libera la conexión
    connection.release();
  }
});

// Editar un bien
apiRouter.put("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    category_id,
    institutional_code,
    senescyt_code,
    barcode,
    model,
    status,
    area_id,
    notes,
  } = req.body;

  const query = `
    UPDATE bienes
    SET name = ?, description = ?, category_id = ?, institutional_code = ?, senescyt_code = ?, barcode = ?, model = ?, status = ?, area_id = ?, notes = ?
    WHERE asset_id = ?
  `;
  try {
    const [results] = await db.execute(query, [
      name,
      description,
      category_id,
      institutional_code,
      senescyt_code,
      barcode,
      model,
      status,
      area_id,
      notes,
      id,
    ]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }
    res.json({ message: "Bien actualizado exitosamente" });
  } catch (err) {
    console.error("Error al editar el bien:", err);
    res.status(500).json({ error: "Error al editar el bien" });
  }
});

// Eliminar un bien
apiRouter.delete("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM bienes WHERE asset_id = ?";
  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }
    res.json({ message: "Bien eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el bien:", err);
    res.status(500).json({ error: "Error al eliminar el bien" });
  }
});

// Rutas de áreas

// Obtener todas las áreas
apiRouter.get("/areas", async (req, res) => {
  const query = "SELECT * FROM areas";
  try {
    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener las áreas:", err);
    res.status(500).json({ error: "Error al obtener las áreas" });
  }
});

// Crear una nueva área
apiRouter.post("/areas", async (req, res) => {
  const { name, description, parent_area_id } = req.body;
  const query =
    "INSERT INTO areas (name, description, parent_area_id) VALUES (?, ?, ?)";
  try {
    const [results] = await db.execute(query, [
      name,
      description,
      parent_area_id || null,
    ]);
    res
      .status(201)
      .json({ message: "Área creada exitosamente", areaId: results.insertId });
  } catch (err) {
    console.error("Error al crear el área:", err);
    res.status(500).json({ error: "Error al crear el área" });
  }
});

// Editar un área
apiRouter.put("/areas/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, parent_area_id } = req.body;
  const query = `
    UPDATE areas
    SET name = ?, description = ?, parent_area_id = ?
    WHERE area_id = ?
  `;
  try {
    const [results] = await db.execute(query, [
      name,
      description,
      parent_area_id || null,
      id,
    ]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Área no encontrada" });
    }
    res.json({ message: "Área actualizada exitosamente" });
  } catch (err) {
    console.error("Error al editar el área:", err);
    res.status(500).json({ error: "Error al editar el área" });
  }
});

// Eliminar un área
apiRouter.delete("/areas/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM areas WHERE area_id = ?";
  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Área no encontrada" });
    }
    res.json({ message: "Área eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el área:", err);
    res.status(500).json({ error: "Error al eliminar el área" });
  }
});
// Categories routes

// Obtener todas las categorías
apiRouter.get("/categories", async (req, res) => {
  // Consulta SQL para obtener todas las categorías
  const query = "SELECT * FROM asset_categories";

  try {
    // Ejecutamos la consulta
    const [rows] = await db.execute(query);

    // Respondemos con el resultado
    res.status(200).json(rows);
  } catch (err) {
    // Manejamos errores
    console.error("Error al obtener las categorías:", err);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
});

// Crear una nueva categoría
apiRouter.post("/categories", (req, res) => {
  const { name, description, parent_category_id } = req.body;
  const query =
    "INSERT INTO asset_categories (name, description, parent_category_id) VALUES (?, ?, ?)";

  db.query(
    query,
    [name, description, parent_category_id || null],
    (err, results) => {
      if (err) {
        console.error("Error al crear la categoría:", err);
        return res.status(500).json({ error: "Error al crear la categoría" });
      }
      res.status(201).json({
        message: "Categoría creada exitosamente",
        categoryId: results.insertId,
      });
    }
  );
});

// Editar una categoría
apiRouter.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, parent_category_id } = req.body;
  const query = `
    UPDATE asset_categories
    SET name = ?, description = ?, parent_category_id = ?
    WHERE category_id = ?`;

  db.query(
    query,
    [name, description, parent_category_id || null, id],
    (err, results) => {
      if (err) {
        console.error("Error al editar la categoría:", err);
        return res.status(500).json({ error: "Error al editar la categoría" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      res.json({ message: "Categoría actualizada exitosamente" });
    }
  );
});

// Eliminar una categoría
apiRouter.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM asset_categories WHERE category_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar la categoría:", err);
      return res.status(500).json({ error: "Error al eliminar la categoría" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría eliminada exitosamente" });
  });
});
app.get('/api/asset_categories/:category_id', async (req, res) => {
  const { category_id } = req.params;
  
  try {
    // Consulta para obtener la categoría por su ID
    const [category] = await db.query('SELECT * FROM asset_categories WHERE category_id = ?', [category_id]);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Responder con los datos de la categoría
    res.json(category);
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
app.get('/api/areas/:area_id', async (req, res) => {
  const { area_id } = req.params;

  try {
    // Consulta para obtener el área por su ID
    const [area] = await db.query('SELECT name FROM areas WHERE area_id = ?', [area_id]);

    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }

    // Responder con el nombre del área
    res.json(area);
  } catch (error) {
    console.error("Error al obtener el área:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Montar el router API con el prefijo '/api'
app.use("/api", apiRouter);

// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
