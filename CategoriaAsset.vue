<template>
    <div class="category-asset">
      <h1>Categorías de Bienes</h1>
  
      <!-- Botón para crear nueva categoría -->
      <button @click="openCreateCategoryModal" class="btn-create">
        Crear nueva categoría
      </button>
  
      <!-- Lista de categorías -->
      <div class="category-list">
        <div v-if="loading" class="loading">Cargando categorías...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <table v-if="!loading && !error">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.category_id">
              <td>{{ category.name }}</td>
              <td>{{ category.description || 'Sin descripción' }}</td>
              <td>
                <button @click="editCategory(category)" class="btn-edit">Editar</button>
                <button @click="deleteCategory(category.category_id)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal para crear/editar categoría -->
      <div v-if="showModal" class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
        <div class="modal-content">
          <h2 id="modal-title">{{ isEditing ? 'Editar' : 'Crear Nueva' }} Categoría</h2>
          <form @submit.prevent="saveCategory" aria-describedby="form-description">
            <div class="form-group">
              <label for="name">Nombre:</label>
              <input 
                type="text" 
                id="name" 
                v-model="newCategory.name" 
                required 
                :class="{ 'error': validationErrors.name }"
                aria-invalid="validationErrors.name ? true : false"
              />
              <span v-if="validationErrors.name" class="error-message">
                {{ validationErrors.name }}
              </span>
            </div>
            <div class="form-group">
              <label for="description">Descripción:</label>
              <textarea 
                id="description" 
                v-model="newCategory.description"
                :class="{ 'error': validationErrors.description }"
                aria-invalid="validationErrors.description ? true : false"
              ></textarea>
              <span v-if="validationErrors.description" class="error-message">
                {{ validationErrors.description }}
              </span>
            </div>
            <div class="button-group">
              <button type="submit" class="btn-submit">
                {{ isEditing ? 'Actualizar' : 'Guardar' }}
              </button>
              <button type="button" @click="closeModal" class="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  const API_BASE_URL = 'http://localhost:3000/api';
  
  export default {
    data() {
      return {
        categories: [],
        newCategory: {
          name: '',
          description: '',
          category_id: null
        },
        showModal: false,
        loading: false,
        error: null,
        isEditing: false,
        validationErrors: {}
      };
    },
    methods: {
      async fetchCategories() {
        this.loading = true;
        this.error = null;
        try {
          const response = await fetch(`${API_BASE_URL}/categories`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.categories = await response.json();
        } catch (error) {
          console.error("Error al obtener las categorías:", error);
          this.error = "Error al cargar las categorías. Por favor, intente nuevamente.";
        } finally {
          this.loading = false;
        }
      },
  
      validateForm() {
        this.validationErrors = {};
        if (!this.newCategory.name.trim()) {
          this.validationErrors.name = 'El nombre es requerido';
        }
        return Object.keys(this.validationErrors).length === 0;
      },
  
      async saveCategory() {
        if (!this.validateForm()) return;
  
        try {
          const url = this.isEditing
            ? `${API_BASE_URL}/categories/${this.newCategory.category_id}`
            : `${API_BASE_URL}/categories`;
  
          const method = this.isEditing ? 'PUT' : 'POST';
  
          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.newCategory),
          });
  
          if (!response.ok) {
            throw new Error(this.isEditing
              ? "Error al actualizar la categoría"
              : "Error al crear la categoría"
            );
          }
  
          const result = await response.json();
          this.$emit('category-saved', result);
  
          alert(this.isEditing
            ? "Categoría actualizada exitosamente"
            : "Categoría creada exitosamente"
          );
  
          await this.fetchCategories();
          this.closeModal();
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      },
  
      editCategory(category) {
        this.isEditing = true;
        this.newCategory = { ...category };
        this.showModal = true;
      },
  
      async deleteCategory(categoryId) {
        if (!confirm("¿Está seguro de eliminar esta categoría?")) return;
  
        try {
          const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: "DELETE",
          });
  
          if (!response.ok) {
            throw new Error("Error al eliminar la categoría");
          }
  
          alert("Categoría eliminada exitosamente");
          await this.fetchCategories();
        } catch (error) {
          console.error(error);
          alert("Hubo un error al eliminar la categoría");
        }
      },
  
      openCreateCategoryModal() {
        this.isEditing = false;
        this.newCategory = { name: '', description: '', category_id: null };
        this.showModal = true;
      },
  
      closeModal() {
        this.showModal = false;
        this.isEditing = false;
        this.newCategory = { name: '', description: '', category_id: null };
        this.validationErrors = {};
      },
    },
    mounted() {
      this.fetchCategories();
    },
  };
  </script>
  
  <style scoped>
  .category-asset {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  .btn-create {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    margin-bottom: 20px;
    transition: background-color 0.3s;
  }
  
  .btn-create:hover {
    background-color: #218838;
  }
  
  .category-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  tr:hover {
    background-color: #f2f2f2;
  }
  
  .btn-edit, .btn-delete {
    padding: 6px 12px;
    margin: 0 4px;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }
  
  .btn-edit {
    background-color: #ffc107;
    color: #000;
  }
  
  .btn-edit:hover {
    background-color: #e0a800;
  }
  
  .btn-delete {
    background-color: #dc3545;
    color: white;
  }
  
  .btn-delete:hover {
    background-color: #c82333;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 1.5em;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    transition: border-color 0.3s;
  }
  
  input:focus, textarea:focus {
    border-color: #007bff;
    outline: none;
  }
  
  input.error, textarea.error {
    border-color: #dc3545;
  }
  
  .error-message {
    color: #dc3545;
    font-size: 0.85em;
    margin-top: 0.3em;
    display: block;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn-submit, .btn-cancel {
    flex: 1;
    padding: 10px;
    border-radius: 4px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }
  
  .btn-submit {
    background-color: #007bff;
    color: white;
  }
  
  .btn-submit:hover {
    background-color: #0056b3;
  }
  
  .btn-cancel {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-cancel:hover {
    background-color: #5a6268;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .error {
    color: #dc3545;
    text-align: center;
    padding: 20px;
    background-color: #f8d7da;
    border-radius: 4px;
    margin: 10px 0;
  }
  </style>
  