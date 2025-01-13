<template>
  <div>
    <h2>Lista de Áreas</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Área Padre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in areas" :key="area.area_id">
          <td>{{ area.name }}</td>
          <td>{{ area.description }}</td>
          <td>{{ area.parent_area_id ? area.parent_area_name : 'Ninguna' }}</td>
          <td>
            <button @click="editArea(area)">Editar</button>
            <button @click="confirmDelete(area)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de edición -->
    <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <button @click="closeEditModal" class="btn-close-modal">X</button>
        <h3>Editar Área</h3>
        <form @submit.prevent="submitEditForm">
          <div class="form-group">
            <label for="edit-name">Nombre del Área</label>
            <input type="text" id="edit-name" v-model="editForm.name" required />
          </div>
          <div class="form-group">
            <label for="edit-description">Descripción</label>
            <textarea id="edit-description" v-model="editForm.description"></textarea>
          </div>
          <div class="form-group">
            <label for="edit-parent-area">Área Padre</label>
            <select id="edit-parent-area" v-model="editForm.parent_area_id">
              <option value="">Seleccione un área padre (opcional)</option>
              <option v-for="area in areas" :key="area.area_id" :value="area.area_id">
                {{ area.name }}
              </option>
            </select>
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <button @click="closeDeleteModal" class="btn-close-modal">X</button>
        <h3>¿Estás seguro de que deseas eliminar esta área?</h3>
        <p><strong>{{ deleteArea?.name }}</strong></p>
        <button @click="deleteAreaFromDatabase">Sí, Eliminar</button>
        <button @click="closeDeleteModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'AreaList',
  data() {
    return {
      areas: [],  // Lista de áreas
      isEditModalOpen: false,  // Modal de edición
      isDeleteModalOpen: false,  // Modal de eliminación
      editForm: {
        name: '',
        description: '',
        parent_area_id: null
      },
      deleteArea: null  // Almacena el área a eliminar
    };
  },
  mounted() {
    this.fetchAreas(); // Cargar áreas al iniciar
    this.setupSocket(); // Configurar WebSocket para recibir actualizaciones
  },
  methods: {
    setupSocket() {
      // Conectar al servidor WebSocket
      const socket = io('http://localhost:3000');  // Asegúrate de que el servidor también esté configurado para emitir eventos

      // Escuchar eventos de actualización de áreas
      socket.on('area-updated', () => {
        this.fetchAreas(); // Actualizar la lista de áreas en tiempo real
      });

      socket.on('area-added', () => {
        this.fetchAreas(); // Actualizar lista cuando se agregue un área
      });

      socket.on('area-deleted', () => {
        this.fetchAreas(); // Actualizar lista cuando se elimine un área
      });
    },
    fetchAreas() {
      axios.get('http://localhost:3000/api/areas')
        .then(response => {
          this.areas = response.data;
        })
        .catch(error => {
          console.error('Error al obtener las áreas:', error);
        });
    },

    editArea(area) {
      this.editForm = { ...area }; // Llenar el formulario con los datos del área a editar
      this.isEditModalOpen = true; // Abrir modal de edición
    },

    submitEditForm() {
      axios.put(`http://localhost:3000/api/areas/${this.editForm.area_id}`, this.editForm)
        .then(response => {
          this.fetchAreas(); // Actualizar las áreas después de editar
          this.closeEditModal();
        })
        .catch(error => {
          console.error('Error al editar el área:', error);
        });
    },

    confirmDelete(area) {
      this.deleteArea = area; // Guardar el área a eliminar
      this.isDeleteModalOpen = true; // Abrir el modal de eliminación
    },

    closeEditModal() {
      this.isEditModalOpen = false; // Cerrar el modal de edición
      this.editForm = {
        name: '',
        description: '',
        parent_area_id: null
      };
    },

    closeDeleteModal() {
      this.isDeleteModalOpen = false; // Cerrar el modal de eliminación
      this.deleteArea = null;
    },

    deleteAreaFromDatabase() {
      axios.delete(`http://localhost:300/api/areas/${this.deleteArea.area_id}`)
        .then(response => {
          this.fetchAreas(); // Actualizar las áreas después de eliminar
          this.closeDeleteModal();
        })
        .catch(error => {
          console.error('Error al eliminar el área:', error);
        });
    }
  }
};

</script>

<style scoped>
/* Estilos para la tabla */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

/* Estilos para los botones */
button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 5px;
}

button:hover {
  background-color: #45a049;
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-close-modal {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn-close-modal:hover {
  background-color: #d32f2f;
}
</style>
