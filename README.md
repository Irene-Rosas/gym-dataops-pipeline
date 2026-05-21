# 🏋️‍♂️ Gym DataOps Pipeline E2E

Este proyecto consiste en el diseño y despliegue de una arquitectura de datos moderna y automatizada (End-to-End) para la gestión y análisis de clientes en un centro deportivo.

## 🏗️ Arquitectura del Sistema
El flujo de datos está completamente desacoplado, separando el almacenamiento de la computación mediante tecnologías Cloud:
1. **Generación y Carga:** Usamos **Python (Pandas)** en Google Colab para la simulación masiva de datos de clientes (50.000 filas).
2. **Data Lake:** Almacenamiento directo automatizado en formato **CSV** en la nube (**Google Drive**).
3. **ETL y Automatización:** Un motor de **JavaScript (Apps Script)** extrae el archivo de la nube "al vuelo", realiza el procesamiento y alimenta la interfaz.
4. **Visualización y Alerta:** Automatización del Dashboard interactivo en Google Sheets y envío automatizado de correos de control.

## 🛠️ Tecnologías Utilizadas
- Python (Pandas / Google Colab)
- JavaScript (Google Apps Script)
- Google Drive Cloud Storage (Simulación AWS S3)
- Google Sheets (Dashboard e Interfaz)

## ⏱️ Rendimiento (Big Data Challenge)
Durante la fase de estrés, realizamos una prueba de procesamiento con **50.000 filas**, midiendo el cálculo de promedios de edad entre entornos:
- **JavaScript (Apps Script):** 1.288 ms (Bucle tradicional)
- **Python (Pandas):** 1.56 ms (Optimización vectorial)
*Demostrando que Python procesa volúmenes masivos de datos casi 1.000 veces más rápido.*
