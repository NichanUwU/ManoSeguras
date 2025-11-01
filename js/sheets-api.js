// Configuración - REEMPLAZA con tu URL de Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycby3Ft7ZypdyIeqnyVlhPmR5HWrTQLQ4WrxY8qdvBhBvdB0CUNWP_zxZbiu3aafxJyNW7A/exec';

class SheetsAPI {
    // Guardar trabajador
    static async saveWorker(workerData) {
        try {
            console.log('Guardando trabajador...', workerData);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'saveWorker',
                    data: workerData
                })
            });
            
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            
            if (result.success) {
                // También guardar en localStorage como caché
                SheetsAPI.updateLocalStorage(workerData);
            }
            
            return result;
        } catch (error) {
            console.error('Error guardando trabajador:', error);
            // Fallback a localStorage
            return SheetsAPI.saveToLocalStorage(workerData);
        }
    }

    // Obtener todos los trabajadores
    static async getWorkers() {
        try {
            console.log('Obteniendo trabajadores...');
            
            const response = await fetch(`${API_URL}?action=getWorkers&timestamp=${Date.now()}`);
            const result = await response.json();
            
            console.log('Respuesta del servidor:', result);
            
            if (result.success && result.workers) {
                // Guardar en localStorage como caché
                localStorage.setItem('manoseguras_workers', JSON.stringify(result.workers));
                localStorage.setItem('manoseguras_last_update', Date.now().toString());
                return result.workers;
            } else {
                throw new Error(result.message || 'Error obteniendo trabajadores');
            }
        } catch (error) {
            console.error('Error obteniendo trabajadores:', error);
            // Fallback a localStorage
            return SheetsAPI.getFromLocalStorage();
        }
    }

    // Métodos de fallback a localStorage
    static saveToLocalStorage(workerData) {
        try {
            let workers = JSON.parse(localStorage.getItem('manoseguras_workers') || '[]');
            workerData.id = workerData.id || Date.now().toString();
            workerData.fechaRegistro = new Date().toISOString();
            workers.push(workerData);
            localStorage.setItem('manoseguras_workers', JSON.stringify(workers));
            return { success: true, message: 'Guardado localmente (modo offline)' };
        } catch (error) {
            console.error('Error guardando localmente:', error);
            return { success: false, message: 'Error guardando los datos' };
        }
    }

    static getFromLocalStorage() {
        try {
            const workers = JSON.parse(localStorage.getItem('manoseguras_workers') || '[]');
            console.log('Datos obtenidos de localStorage:', workers);
            return workers;
        } catch (error) {
            console.error('Error obteniendo datos locales:', error);
            return [];
        }
    }

    static updateLocalStorage(workerData) {
        try {
            let workers = JSON.parse(localStorage.getItem('manoseguras_workers') || '[]');
            workerData.id = workerData.id || Date.now().toString();
            workerData.fechaRegistro = new Date().toISOString();
            workers.push(workerData);
            localStorage.setItem('manoseguras_workers', JSON.stringify(workers));
        } catch (error) {
            console.error('Error actualizando localStorage:', error);
        }
    }

    // Probar la conexión con la API
    static async testConnection() {
        try {
            const response = await fetch(`${API_URL}?action=test&timestamp=${Date.now()}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error probando conexión:', error);
            return { success: false, message: 'Sin conexión' };
        }
    }
}