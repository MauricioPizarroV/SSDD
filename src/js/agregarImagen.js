import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 20, // en MB
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, // Cambia a true si deseas que se suba automáticamente
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El límite es un archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function() {
        const dropzone = this;  
        const btnPublicar = document.querySelector('#publicar');

        if (btnPublicar) {
            btnPublicar.addEventListener('click', function() {
                console.log('Processing queue');
                dropzone.processQueue();
            });
        }

        dropzone.on('queuecomplete', function() {
            if (dropzone.getActiveFiles().length === 0) {
                window.location.href = '/mis-propiedades';
            }
        });
    }
};