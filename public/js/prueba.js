/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/prueba.js":
/*!**************************!*\
  !*** ./src/js/prueba.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n\r\n    const filtros = {\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n    //Filtrado\r\n    categoriasSelect.addEventListener('change', e =>{\r\n        filtros.categoria = +e.target.value\r\n    })\r\n    preciosSelect.addEventListener('change', e =>{\r\n        filtros.precio = +e.target.value\r\n    })\r\n    \r\n    const obtenerEquipos = async () => {\r\n        try {\r\n            const url = '/api/equipos'\r\n            const respuesta = await fetch(url)\r\n            const equipos = await respuesta.json()\r\n            console.log(equipos)\r\n            \r\n    \r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n    \r\n    obtenerEquipos()\r\n})()\n\n//# sourceURL=webpack://ssdd/./src/js/prueba.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/prueba.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;