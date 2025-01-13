<template>
  <div class="asset-list">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Código Institucional</th>
          <th>Código SENESCYT</th>
          <th>Código de Barra</th>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" :key="asset.asset_id">
          <td>{{ asset.name }}</td>
          <td>{{ asset.description }}</td>
          <td>{{ asset.institutional_code }}</td>
          <td>{{ asset.senescyt_code }}</td>
          <td>{{ asset.barcode }}</td>
          <td>{{ asset.model }}</td>
          <td>{{ asset.brand }}</td> <!-- Se actualiza a 'brand' -->
          <td>{{ asset.status }}</td>
          <td>
            <button @click="editAsset(asset.asset_id)"><i class='bx bx-edit'></i></button>
            <button @click="deleteAsset(asset.asset_id)"><i class='bx bx-trash'></i></button>
            <button @click="generateQR(asset)"><i class='bx bx-qr'></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Axios from 'axios';  // Usando Axios para realizar la solicitud
import QRCode from 'qrcode';
import { useToast } from 'vue-toastification';  // Importar el servicio de Toast
import Swal from 'sweetalert2';  // Importamos SweetAlert2

export default {
  data() {
    return {
      assets: [],  // Aquí almacenamos los bienes
    };
  },
  methods: {
    // Método para obtener todos los bienes
    async fetchAssets() {
      try {
        const response = await Axios.get("http://localhost:3000/api/bienes");  // Llamamos a la API
        this.assets = response.data;  // Asignamos los resultados a la propiedad assets
      } catch (error) {
        console.error("Error al obtener los bienes:", error);
        this.showToast('Error al obtener los bienes', 'error');
      }
    },

    // Método para redirigir al formulario de edición de un bien
    editAsset(assetId) {
      this.$router.push({ name: "EditAsset", params: { id: assetId } });
    },

    // Método para eliminar un bien usando SweetAlert2 para confirmación
    async deleteAsset(assetId) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción no se puede deshacer",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        });

        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
          const response = await Axios.delete(`http://localhost:3000/api/bienes/${assetId}`);  // Eliminamos el bien
          if (response.status === 200) {
            this.showToast('Bien eliminado exitosamente', 'success');
            this.fetchAssets();  // Refrescamos la lista de bienes después de eliminar
          } else {
            throw new Error("Error al eliminar el bien");
          }
        }
      } catch (error) {
        console.error(error);
        this.showToast('Hubo un error al eliminar el bien', 'error');
      }
    },

    // Método para generar un código QR para un bien
    async generateQR(asset) {
      try {
        // Hacemos dos solicitudes para obtener la categoría y el área usando las IDs
        const categoryResponse = await Axios.get(`http://localhost:3000/api/asset_categories/${asset.category_id}`);
        const areaResponse = await Axios.get(`http://localhost:3000/api/areas/${asset.area_id}`);

        // Suponemos que `asset` tiene la información del responsable del bien
        const responsible = asset.responsible || "No asignado";  // Si no tiene responsable, lo asignamos como "No asignado"

        // Creamos un objeto con todos los datos relevantes del bien, ahora con los nombres de categoría y área
        const assetData = {
          name: asset.name,                        // Nombre del bien
          description: asset.description,          // Descripción del bien
          category: categoryResponse.data.name,    // Nombre de la categoría
          location: areaResponse.data.name,        // Nombre del área
          status: asset.status,                    // Estado (Activo, Inactivo, etc.)
          institutional_code: asset.institutional_code, // Código institucional
          senescyt_code: asset.senescyt_code,      // Código SENESCYT
          barcode: asset.barcode,                  // Código de barras
          model: asset.model,                      // Modelo
          notes: asset.notes,                      // Notas adicionales
          responsible: responsible                 // Responsable del bien
        };

        // Convertimos la información a un formato legible para el QR
        const assetDataString = `
      Nombre: ${assetData.name}
      Descripción: ${assetData.description}
      Categoría: ${assetData.category}
      Ubicación: ${assetData.location}
      Estado: ${assetData.status}
      Código Institucional: ${assetData.institutional_code}
      Código SENESCYT: ${assetData.senescyt_code}
      Código de Barra: ${assetData.barcode}
      Modelo: ${assetData.model}
      Notas: ${assetData.notes}
      Responsable: ${assetData.responsible}
    `;

        // Generamos el código QR usando los datos completos del asset
        const qrCodeData = await QRCode.toDataURL(assetDataString.trim());  // Generamos el código QR

        // Crear un enlace para descargar el código QR generado
        const link = document.createElement("a");
        link.href = qrCodeData;
        link.download = `QR_${asset.name}.png`;  // El archivo descargado llevará el nombre del bien
        link.click();  // Ejecutamos la descarga

        this.showToast('Código QR generado y descargado exitosamente', 'success');
      } catch (error) {
        console.error("Error al generar el código QR:", error);
        this.showToast('Hubo un error al generar el código QR', 'error');
      }
    },


    // Método para mostrar toasts
    showToast(message, type) {
      const toast = useToast();
      toast[type](message);  // 'success', 'error', 'info', etc.
    }
  },
  mounted() {
    this.fetchAssets();  // Cargamos los bienes al cargar el componente
  },
};
</script>
<style scoped>
.asset-list {
  max-width: 900px;
  margin: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  margin: 0 5px;
  padding: 0.5em 1em;
  font-size: 0.9em;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
}
</style>
