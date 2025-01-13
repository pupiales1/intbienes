<template>
  <div class="asset-form">
    <h1>Registro de Bien</h1>
    <form @submit.prevent="saveAsset">
      <div class="form-grid">
        <!-- Nombre del Bien -->
        <div class="form-group">
          <label for="name">Nombre del Bien:</label>
          <input type="text" id="name" v-model="asset.name" required />
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="description">Descripción:</label>
          <textarea id="description" v-model="asset.description" rows="2"></textarea>
        </div>

        <!-- Categoría -->
        <div class="form-group">
          <label for="category_id">Categoría:</label>
          <select id="category_id" v-model="asset.category_id" required>
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Código Institucional -->
        <div class="form-group">
          <label for="institutional_code">Código Institucional:</label>
          <input type="text" id="institutional_code" v-model="asset.institutional_code" />
        </div>

        <!-- Código Senescyt -->
        <div class="form-group">
          <label for="senescyt_code">Código Senescyt:</label>
          <input type="text" id="senescyt_code" v-model="asset.senescyt_code" />
        </div>

        <!-- Código de Barras -->
        <div class="form-group">
          <label for="barcode">Código de Barras:</label>
          <input type="text" id="barcode" v-model="asset.barcode" />
        </div>

        <!-- Modelo -->
        <div class="form-group">
          <label for="model">Modelo:</label>
          <input type="text" id="model" v-model="asset.model" />
        </div>

        <!-- Estado -->
        <div class="form-group">
          <label for="status">Estado:</label>
          <select id="status" v-model="asset.status" required>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En Reparación">En Reparación</option>
            <option value="Dado de Baja">Dado de Baja</option>
          </select>
        </div>

        <!-- Ubicación -->
        <div class="form-group">
          <label for="area_id">Ubicación:</label>
          <select id="area_id" v-model="asset.area_id" required>
            <option value="" disabled>Seleccione una ubicación</option>
            <option v-for="area in areas" :key="area.area_id" :value="area.area_id">
              {{ area.name }}
            </option>
          </select>
        </div>

        <!-- Notas -->
        <div class="form-group">
          <label for="notes">Notas:</label>
          <textarea id="notes" v-model="asset.notes" rows="2"></textarea>
        </div>

        <!-- Clase de Bien -->
        <div class="form-group">
          <label for="class_of_good">Clase de Bien:</label>
          <input type="text" id="class_of_good" v-model="asset.class_of_good" />
        </div>

        <!-- Marca -->
        <div class="form-group">
          <label for="brand">Marca:</label>
          <input type="text" id="brand" v-model="asset.brand" />
        </div>

        <!-- Fecha de Compra -->
        <div class="form-group">
          <label for="purchase_date">Fecha de Compra:</label>
          <input type="date" id="purchase_date" v-model="asset.purchase_date" />
        </div>

        <!-- Valor de Compra -->
        <div class="form-group">
          <label for="purchase_value">Valor de Compra:</label>
          <input type="number" id="purchase_value" v-model="asset.purchase_value" step="0.01" />
        </div>

        <!-- Valor Actual -->
        <div class="form-group">
          <label for="current_value">Valor Actual:</label>
          <input type="number" id="current_value" v-model="asset.current_value" step="0.01" />
        </div>

        <!-- Responsable Institucional -->
        <div class="form-group">
          <label for="institutional_responsible">Responsable Institucional:</label>
          <multiselect v-model="asset.institutional_responsible" :options="users" :multiple="true"
            :close-on-select="false" :clear-on-select="false" :preserve-search="true"
            placeholder="Seleccione responsables" label="full_name" track-by="user_id"></multiselect>
        </div>

      </div>

      <div class="form-actions">
        <button type="submit" class="btn">Guardar Bien</button>
      </div>
    </form>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect"; // Asegúrate de importar el componente Multiselect

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      asset: {
        name: "",
        description: "",
        category_id: null,
        institutional_code: "",
        senescyt_code: "",
        barcode: "",
        model: "",
        status: "Activo",
        area_id: null,
        notes: "",
        class_of_good: "",
        brand: "",
        purchase_date: "",
        purchase_value: null,
        current_value: null,
        institutional_responsible: [], // Cambiado a un arreglo
      },
      categories: [],
      areas: [],
      users: [], // Lista de usuarios para el campo multiselect
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        if (!response.ok) throw new Error("Error al obtener las categorías");
        this.categories = await response.json();
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    },
    async fetchAreas() {
      try {
        const response = await fetch("http://localhost:3000/api/areas");
        if (!response.ok) throw new Error("Error al obtener las áreas");
        this.areas = await response.json();
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      }
    },
    async fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        this.users = await response.json();
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    },
    async saveAsset() {
      try {
        const response = await fetch("http://localhost:3000/api/bienes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.asset),
        });
        if (!response.ok) throw new Error("Error al guardar el bien");
        alert("Bien guardado exitosamente");
        this.resetForm();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al guardar el bien");
      }
    },
    resetForm() {
      this.asset = {
        name: "",
        description: "",
        category_id: null,
        institutional_code: "",
        senescyt_code: "",
        barcode: "",
        model: "",
        status: "Activo",
        area_id: null,
        notes: "",
        class_of_good: "",
        brand: "",
        purchase_date: "",
        purchase_value: null,
        current_value: null,
        institutional_responsible: [], // Restablecer a un arreglo vacío
      };
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchAreas();
    this.fetchUsers(); // Cargar usuarios al montar el componente
  },
};
</script>

<style scoped>
/* Contenedor del formulario */
.form-group {
  margin-bottom: 1.5rem;
}

/* Estilo para el label */
.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
}

/* Contenedor del multiselect */
.multiselect {
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  padding: 0.5rem;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* Estilo cuando el multiselect está enfocado */
.multiselect:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
  outline: none;
}

/* Opciones seleccionadas */
.multiselect__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* Estilo de cada etiqueta */
.multiselect__tag {
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

/* Botón para eliminar una etiqueta */
.multiselect__tag-icon {
  margin-left: 0.3rem;
  color: #fff;
  cursor: pointer;
}

/* Lista desplegable */
.multiselect__content {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 0.3rem;
  z-index: 1000;
}

/* Opciones de la lista */
.multiselect__option {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.multiselect__option:hover {
  background-color: #f1f1f1;
}

/* Opción seleccionada */
.multiselect__option--selected {
  background-color: #007bff;
  color: #fff;
}

/* Placeholder */
.multiselect__placeholder {
  color: #999;
}

/* Botón para limpiar selección */
.multiselect__clear {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.multiselect__clear:hover {
  color: #333;
}
.asset-form {
  max-width: 1000px;
  margin: auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: none;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
