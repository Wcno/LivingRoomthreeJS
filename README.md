# 🏠 LivingRoomthreeJS

**Proyecto Semestral - Computación Gráfica**

Una simulación interactiva de una sala de estar en 3D desarrollada con Three.js, que incluye mobiliario detallado, texturas realistas, iluminación dinámica y animaciones.

![Three.js](https://img.shields.io/badge/Three.js-0.166.1-black?style=flat-square&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-5.3.3-646CFF?style=flat-square&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript)

## 🌟 Características

- **Modelo 3D interactivo** de una sala de estar completa
- **Texturas realistas** aplicadas a diferentes objetos (balón de fútbol, paredes, libros)
- **Iluminación dinámica** con luz ambiental y direccional
- **Animaciones** para elementos como libros
- **Controles interactivos** con OrbitControls para navegación
- **Panel de control GUI** para ajustar propiedades en tiempo real
- **Modo de selección** para cambiar colores de objetos mediante clicks
- **Efectos especiales** como agua translúcida en pecera
- **Sombras realistas** con PCF Soft Shadow Map

## 🎮 Controles e Interacciones

### Navegación
- **Ratón**: Rotar vista alrededor de la escena
- **Scroll**: Zoom in/out
- **Click derecho + arrastrar**: Paneo

### Panel de Control (GUI)
- **🎨 Cambiar color al objeto**: Selector de color para objetos clickeables
- **🖱️ Modo selección**: Activar/desactivar la selección por click
- **💡 Control de luz**: Ajustar intensidad de la iluminación direccional

## 🏗️ Estructura del Proyecto

```
LivingRoomthreeJS/
├── src/
│   ├── index.html          # Página principal
│   ├── script.js           # Lógica principal de Three.js
│   └── style.css           # Estilos CSS
├── static/
│   ├── models/
│   │   └── semestral.glb   # Modelo 3D de la sala
│   └── textures/
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Tecnologías Utilizadas

- **Three.js** (v0.166.1) - Motor de renderizado 3D
- **Vite** (v5.3.3) - Herramienta de construcción y desarrollo
- **lil-gui** (v0.19.2) - Panel de control interactivo
- **GLTF Loader** - Carga de modelos 3D
- **OrbitControls** - Controles de cámara
- **WebGL** - Renderizado por hardware

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Wcno/LivingRoomthreeJS.git
   cd LivingRoomthreeJS
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en navegador**
   - El proyecto se abrirá automáticamente en `http://localhost:5173`

### Construcción para Producción

```bash
# Construir proyecto
npm run build

# Vista previa de construcción
npm run preview

# Desplegar en GitHub Pages
npm run deploy
```

