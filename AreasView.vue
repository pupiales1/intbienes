<template>
  <div>
    <div class="areas-content">
      <h2>Gestión de Áreas</h2>
       <!-- Botón para abrir el Modal de Registrar Área -->
       <div class="form-group">
        <button class="button type1" type="button" @click="openModal">Registrar Área</button>
      </div>
      <!-- Aquí se muestra el componente de la lista de áreas -->
      <AreaList />
      <!-- Modal para Registrar Área -->
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <!-- Botón para cerrar el modal -->
          <button @click="closeModal" class="btn-close-modal">X</button>
          <!-- Incluir el formulario de AreaForm.vue en el modal -->
          <AreaForm @close="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaList from '../components/areas/AreaList.vue';
import AreaForm from '../components/areas/AreaForm.vue';

export default {
  name: 'AreasView',
  components: {
    AreaList,
    AreaForm,
  },
  data() {
    return {
      isModalOpen: false, // Controla si el modal está abierto o cerrado
    };
  },
  methods: {
    // Abre el modal
    openModal() {
      this.isModalOpen = true;
    },

    // Cierra el modal
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
/* Overlay del modal - fondo oscuro con efecto de desenfoque */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* Contenedor principal del modal */
.modal-content {
  position: relative;
  width: 95%;
  height: 95vh;
  background: linear-gradient(to right bottom, #ffffff, #f8f9fa);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  overflow-y: auto;
  animation: slideIn 0.4s ease;
}

/* Barra de título del modal */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

/* Botón para cerrar el modal */
.btn-close-modal {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #4a5568;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-close-modal:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

/* Scroll personalizado para el modal */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Estilos responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .btn-close-modal {
    top: 1rem;
    right: 1rem;
    width: 35px;
    height: 35px;
  }
}
.areas-content {
  margin: 20px;
  padding: 20px;
}

h2 {
  font-size: 1.8rem;
  color: #2c3e50;
}

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

.btn-txt {
  z-index: 1;
  font-weight: 800;
  letter-spacing: 4px;
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
