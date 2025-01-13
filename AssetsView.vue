<template>
  <div class="assets-view">
    <div class="assets-content">
      <h2>Gestión de Bienes</h2>
      <section class="button-container">
        <div>
          <button @click="openModal" class="button type1">Registrar Nuevo Bien</button>
        </div>
        <div>
          <button @click="openCategoriesModal" class="button type1">Categorías</button>
        </div>
        <div>
          <button @click="openCategoriesModal" class="button type1">ENTREGAR BIEN</button>
        </div>
      </section>

      <!-- Modal de Bienes -->
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="closeModal" class="btn-close-modal">X</button>
          <AssetForm @close="closeModal" />
        </div>
      </div>

      <!-- Modal para la vista de Categorías -->
      <div v-if="isCategoriesModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="closeCategoriesModal" class="btn-close-modal">X</button>
          <CategoriaAsset @close="closeCategoriesModal" />
        </div>
      </div>

      <!-- Lista de Bienes -->
      <AssetList />
    </div>
  </div>
</template>

<script>
import AssetList from '../components/assets/AssetList.vue';
import AssetForm from '../components/assets/AssetForm.vue';
import CategoriaAsset from '../components/categoria/CategoriaAsset.vue'; // Importar el componente de categorías

export default {
  name: 'AssetsView',
  components: {
    AssetList,
    AssetForm,
    CategoriaAsset,
  },
  data() {
    return {
      isCategoriesModalOpen: false,
      isModalOpen: false, // Controla la visibilidad del modal
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true; // Abre el modal
    },
    closeModal() {
      this.isModalOpen = false; // Cierra el modal
    },
    openCategoriesModal() {
      this.isCategoriesModalOpen = true; // Abre el modal de categorías
    },
    closeCategoriesModal() {
      this.isCategoriesModalOpen = false; // Cierra el modal de categorías
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
.assets-view {
  padding: 20px;
}

.assets-content {
  margin-top: 20px;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
}

/* Estilos para el botón */
.button-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}
.button-container div {
  flex: 1;
}
.button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #45a049;
}

.type1 {
  background-color: #007BFF;
}

.type1:hover {
  background-color: #0056b3;
}

/* Estilos para el Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 20px; /* Agregado espacio en pantallas pequeñas */
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.btn-close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 2rem;
  background: none;
  border: none;
  color: #e95354;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-close-modal:hover {
  color: #c0392b;
}

/* Responsividad */
@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    max-width: 600px;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-width: 450px;
    padding: 15px;
  }
}

/* Animación de transiciones */
.modal-overlay {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Efectos visuales de los botones */
.button {
  height: 50px;
  width: 200px;
  position: relative;
  background-color: transparent;
  cursor: pointer;
  border: 2px solid #252525;
  overflow: hidden;
  border-radius: 30px;
  color: #333;
  transition: all 0.5s ease-in-out;
}

.button:hover {
  box-shadow: 1px 1px 200px #E95354;
  color: #fff;
  border: none;
}

.type1::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.5s ease-in-out;
  background-color: #333;
  border-radius: 30px;
  visibility: hidden;
  height: 10px;
  width: 10px;
  z-index: -1;
}

.button:hover {
  box-shadow: 1px 1px 200px #E95354;
  color: #fff;
  border: none;
}

.type1:hover::after {
  visibility: visible;
  transform: scale(100) translateX(2px);
}

</style>
