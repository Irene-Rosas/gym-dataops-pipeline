Main.gs
/*
function extraerDatos() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Datos_Crudos");
  if (sheet==null) {
    throw new Error("No se encontró la hoja.");
  }
  var matrizDatos = sheet.getDataRange().getValues();
  //Logger.log("Número total de filas: " + matrizDatos.length);
  //Logger.log(matrizDatos[1]);
  //Logger.log(matrizDatos);

  // CORRECCIÓN MÍNIMA: Ahora devuelve los datos puros en lugar de transformarlos aquí.
  return matrizDatos;
} 

function extraerDatosCloud() {
  // 1. Buscamos el archivo en nuestro "Data Lake" (Google Drive)
  var nombreArchivo = "datos_gimnasio_cloud.csv";
  var iteradorArchivos = DriveApp.getFilesByName(nombreArchivo);
  
  // Verificamos si el archivo existe
  if (iteradorArchivos.hasNext()) {
    var archivo = iteradorArchivos.next();
    
    // 2. Extraemos el contenido en formato texto puro
    var contenidoTexto = archivo.getBlob().getDataAsString();
    
    // 3. ¡LA MAGIA! Convertimos el texto CSV en una matriz bidimensional
    var matrizDatos = Utilities.parseCsv(contenidoTexto);
    
    Logger.log("✅ Datos extraídos de la nube correctamente. Filas: " + matrizDatos.length);
    
    // Devolvemos la matriz. A partir de aquí, vuestro código de Calcular.gs 
    // funcionará EXACTAMENTE igual que antes, ¡porque la estructura es la misma!
    return matrizDatos;
    
  } else {
    Logger.log("❌ ERROR: No se encontró el archivo en Drive. Revisa que estés usando el mismo correo.");
    return null;
  }
} */

function carreraVelocidadJS() {
  var datos = extraerDatosCloud(); // Trae las 50.000 filas
  var inicio = new Date().getTime();
  
  var sumaEdad = 0;
  var totalFilas = datos.length;
  
  // Recorremos las 50.000 filas con un bucle
  for (var i = 1; i < totalFilas; i++) {
    sumaEdad += Number(datos[i][0]); // La edad está en la primera columna
  }
  
  var promedio = sumaEdad / (totalFilas - 1);
  var fin = new Date().getTime();
  
  Logger.log("🏁 JS - Promedio de edad: " + promedio.toFixed(2));
  Logger.log("⏱️ JS - Tiempo invertido: " + (fin - inicio) + " milisegundos.");
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Procesos ETL")
    // Se ejecuta la función al pulsar el botón en la interfaz
    .addItem('Ejecutar proceso completo', 'ejecutarProcesoCompleto').addSeparator().addItem('Vista Previa y Envío 🔍', 'abrirVistaPrevia').addToUi();

}

function doGet() {
  const metricas = calcularMetricasDashboard();
  const template = HtmlService.createTemplateFromFile('Dashboard');
  
  // Pasamos los datos a la web
  template.totalClientes = metricas.total;
  template.totalBajas = metricas.bajas;
  template.porcentajeChurn = metricas.porcentaje;
  template.colorAlerta = metricas.color;
  template.contAnual = metricas.anual;
  template.contMensual = metricas.mensual;
  template.mediaEdad = metricas.media;
  
  template.esVistaPrevia = false;
  template.esResumenEmail = false;

  return template.evaluate()
      .setTitle('Dashboard de Bajas - Gym')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function abrirVistaPrevia() {
  const metricas = calcularMetricasDashboard();
  const template = HtmlService.createTemplateFromFile('Dashboard');
  template.esVistaPrevia = true;
  template.esResumenEmail = false;

  // Pasamos los datos a la web
  template.totalClientes = metricas.total;
  template.totalBajas = metricas.bajas;
  template.porcentajeChurn = metricas.porcentaje;
  template.colorAlerta = metricas.color;

  // Renderizar HTML final
  var html = template.evaluate()
    .setWidth(400)
    .setHeight(300);

  // Mostrar modal
  SpreadsheetApp.getUi().showModalDialog(html, "Vista Previa");
}

function enviarCorreoDashboard() {
  const metricas = calcularMetricasDashboard();
  const template = HtmlService.createTemplateFromFile('Dashboard');
  
  // Inyectamos los datos en la plantilla
  template.totalClientes = metricas.total;
  template.totalBajas = metricas.bajas;
  template.porcentajeChurn = metricas.porcentaje;
  template.colorAlerta = metricas.color;
  
  // IMPORTANTE: Aquí decimos que NO es vista previa para que el botón desaparezca del correo
  template.esVistaPrevia = false; 
  template.esResumenEmail = true;
  template.urlAppWeb = "https://script.google.com/macros/s/AKfycbz0KKIV5E5TvgZFQG0ihGiQnl6Im5Rb4Zwx4EbLqgdMXmfm9GLUbUEBdqgiQZreFwOC/exec";
  
  const cuerpoHtml = template.evaluate().getContent();
  
  GmailApp.sendEmail("irene.rosas.contractor@opplus.bbva.com, juanalberto.martos@opplus.bbva.com", 
    "Reporte de Bajas - Gimnasio", 
    "Tu cliente de correo no soporta HTML.", 
    { htmlBody: cuerpoHtml }
  );
  
  SpreadsheetApp.getUi().alert('✅ Informe enviado correctamente a los stakeholders.');
}


Calculo.gs
function extraerDatosCloud() {
  // 1. Buscamos el archivo en nuestro "Data Lake" (Google Drive)
  var nombreArchivo = "datos_gimnasio_cloud.csv";
  var iteradorArchivos = DriveApp.getFilesByName(nombreArchivo);
  
  // Verificamos si el archivo existe
  if (iteradorArchivos.hasNext()) {
    var archivo = iteradorArchivos.next();
    
    // 2. Extraemos el contenido en formato texto puro
    var contenidoTexto = archivo.getBlob().getDataAsString();
    
    // 3. ¡LA MAGIA! Convertimos el texto CSV en una matriz bidimensional
    var matrizDatos = Utilities.parseCsv(contenidoTexto);
    
    Logger.log("✅ Datos extraídos de la nube correctamente. Filas: " + matrizDatos.length);
    
    // Devolvemos la matriz. A partir de aquí, vuestro código de Calcular.gs 
    // funcionará EXACTAMENTE igual que antes, ¡porque la estructura es la misma!
    return matrizDatos;
    
  } else {
    Logger.log("❌ ERROR: No se encontró el archivo en Drive. Revisa que estés usando el mismo correo.");
    return null;
  }
}

function transformarDatos(datosCrudos) {
  if (!datosCrudos || datosCrudos.length < 2) {
    throw new Error("No hay datos suficientes para transformar.");
  }
  // La primera fila contiene los encabezados
  var headers = datosCrudos[0];
  var datos = datosCrudos.slice(1);
  // Localizar índices de las columnas necesarias
  var idChurn = headers.indexOf("Churn");
  var idEdad = headers.indexOf("Age");
  var idDuracion = headers.indexOf("Contract_period");
  var idFrecuencia = headers.indexOf("Avg_class_frequency_total");
  
  if (idChurn === -1 || idEdad === -1 || idDuracion === -1 || idFrecuencia === -1) {
    throw new Error("No se encontraron todas las columnas necesarias en los encabezados.");
  }
  
  // Solo usuarios dados de baja
  var usuariosChurn = datos.filter(function(fila) {
    return Number(fila[idChurn]) == 1;
  });
  
  // Formato limpio con solo las variables clave
  var datosLimpios = usuariosChurn.map(function(fila) {
    return {
      Edad: fila[idEdad],
      DuracionContrato: fila[idDuracion],
      FrecuenciaVisitas: fila[idFrecuencia]
    };
  });
  
  return datosLimpios;
}

function mostrarMensaje(total) {

  // Cargar HTML
  var template = HtmlService.createTemplateFromFile("VistaResumen");

  // Pasar variable dinámica al HTML
  template.totalProcesados = total;

  // Renderizar HTML final
  var html = template.evaluate()
    .setWidth(400)
    .setHeight(300);

  // Mostrar modal
  SpreadsheetApp.getUi().showModalDialog(html, "Proceso ETL");
}

function ejecutarProcesoCompleto(){
  var crudos = extraerDatos();
  var procesados = transformarDatos(crudos);
  
  // CORRECCIÓN MÍNIMA: Añadido JSON.stringify para poder leer los objetos en el Logger
  Logger.log("Datos procesados: " + JSON.stringify(procesados));

  // Guardar resultados en la hoja
  guardarResultados(procesados);

  // Total de registros procesados
  var totalRegistros = procesados.length;

  calcularMetricasDashboard();

  // Mostrar ventana dinámica
  mostrarMensaje(totalRegistros);
}

function calcularMetricasDashboard() {
  // Hoja Resultados_Churn
  var hoja = obtenerHojaResultados();
  var crudo = extraerDatos();

  // El total de bajas es el número de registros en Resultados_Churn
  // Obtener filas de la hoja
  var datosHoja = hoja.getDataRange().getValues();

  // Restamos 1 por el encabezado
  var bajas = datosHoja.length - 1;

  // El total de clientes es el número de registros en los datos crudos
  var total = crudo.length - 1;

  var porcentaje = (bajas/total)*100;

  // Color de alerta según el porcentaje de churn
  var color;

  // Leer DuracionContratos
  var contratos = hoja.getRange("B:B").getValues();

  // Contar contratos anuales y mensuales
  var anual = contratos.filter(function(fila) {
    return fila[0] === 12;
  }).length - 1;

  var mensual = contratos.filter(function(fila) {
    return fila[0] !== 12;
  }).length - 1;

  // Leer Edad
  var edades = hoja.getRange("A:A").getValues();

  // Variables para sumarlas en un bucle for
  var suma = 0;
  var cantidad = 0;

  for (var i = 0; i < edades.length; i++) {
    const edad = edades[i][0];

    // Solo números
    if (typeof edad === "number") {
      suma += edad;
      cantidad++;
    }
  }

  var media = suma / cantidad;

  if (porcentaje > 20) {
    color = "red";
  } else {
    color = "green";
  }

  return {
  total: total,
  bajas: bajas,
  porcentaje: porcentaje,
  color: color,
  anual: anual,
  mensual: mensual,
  media: media
};
}


Auxiliares.gs
function obtenerHojaResultados() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = spreadsheet.getSheetByName("Resultados_Churn");

  // Crear la hoja si no existe
  if (hoja == null) {
    hoja = spreadsheet.insertSheet("Resultados_Churn");
  }

  return hoja;
}

function guardarResultados(datosProcesados) {
  var hoja = obtenerHojaResultados();

  // Limpiar contenido anterior
  hoja.clearContents();

  // Encabezados
  var encabezados = [["Edad", "DuracionContrato", "FrecuenciaVisitas"]];

  // Convertir objetos a matriz bidimensional
  var filas = datosProcesados.map(function(item) {
    return [
      item.Edad,
      item.DuracionContrato,
      item.FrecuenciaVisitas
    ];
  });

  // Unir encabezados + datos
  var matrizFinal = encabezados.concat(filas);

  // Escribir todo de una sola vez
  hoja.getRange(1, 1, matrizFinal.length, matrizFinal[0].length)
       .setValues(matrizFinal).setNumberFormat("0.00"); 
       // Esto último es para que salga el número con el formato correcto

  Logger.log("Datos guardados correctamente en Resultados_Churn");
}


VistaResumen.html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>

      body{
        margin:0;
        padding:0;
        background:#f4f6f9;
        font-family:Arial,sans-serif;
      }

      .contenedor{
        width:100%;
        height:100vh;

        display:flex;
        justify-content:center;
        align-items:center;
      }

      .tarjeta{
        background:white;
        width:300px;

        padding:30px;

        border-radius:14px;

        text-align:center;

        box-shadow:0 4px 14px rgba(0,0,0,0.15);
      }

      h1{
        color:#202124;
        margin:0;
        margin-bottom:10px;
      }

      p{
        color:#5f6368;
        font-size:15px;
        line-height:1.5;
      }

      .numero{
        color:#1a73e8;
        font-weight:bold;
        font-size:22px;
      }

    </style>
  </head>
  <body>
    <div class="contenedor">
      <div class="tarjeta">

        <h1>¡Proceso Completado!</h1>

        <p>
          Se procesaron correctamente
          <span class="numero">
            <?= totalProcesados ?>
          </span>
          registros.
        </p>

      </div>
    </div>
  </body>
</html>


Dashboard.html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>

      body{
        margin:0;
        padding:0;
        background:#f4f6f9;
        font-family:Arial,sans-serif;
      }

      .contenedor{
        width:100%;

        display:flex;
        justify-content:center;
        align-items:center;
      }

      .tarjeta{
        background:white;

        width:300px;

        height:280px;

        padding:30px;

        margin:20px;

        border-radius:14px;

        text-align:center;

        box-shadow:0 4px 14px rgba(0,0,0,0.15);
      }

      h1{
        color: #58595c;
        margin:20px;
        text-align: center;
      }

      p{
        color:#5f6368;
        font-size:15px;
        line-height:1.5;
      }

      .porcentaje{
        color: <?=colorAlerta?>;
        font-weight:bold;
        font-size:22px;
      }

    </style>
  </head>
  <body>
    <? if (esResumenEmail) { ?>
      <h2>Resumen Ejecutivo de Bajas</h2>
      <p>Se han detectado <?= totalBajas ?> bajas este mes.</p>
      <div class="tarjeta">
            <h3>Total de Clientes:</h3>
            <p><?= totalClientes ?></p>
            <h3>Total de Bajas:</h3>
            <p><?= totalBajas ?></p>
            <h3>Porcentaje de Bajas:</h3>
            <span class="porcentaje"><?= porcentajeChurn.toFixed(1) ?>%</span>
          </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="<?= urlAppWeb ?>" style="background: #1a73e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Ver Análisis Interactivo Completo
        </a>
      </div>

    <? } else if (esVistaPrevia) { ?>
      <div style="text-align: center; margin-top: 20px;">
        <div class="contenedor">
          <div class="tarjeta">
            <h3>Total de Clientes:</h3>
            <p><?= totalClientes ?></p>
            <h3>Total de Bajas:</h3>
            <p><?= totalBajas ?></p>
            <h3>Porcentaje de Bajas:</h3>
            <span class="porcentaje"><?= porcentajeChurn.toFixed(1) ?>%</span>
          </div>
        </div>
        <button onclick="google.script.run.enviarCorreoDashboard()" 
                style="background: #1a73e8; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Confirmar y Enviar Informe por Email 📧
        </button>
      </div>
    
    <? } else { ?>
      <h1>Dashboard Interactivo de Negocio - Análisis de bajas</h1>
      <div class="grid-analisis">
        <div class="contenedor">
          <div class="tarjeta">
            <h3>Total de Clientes:</h3>
            <p><?= totalClientes ?></p>
            <h3>Total de Bajas:</h3>
            <p><?= totalBajas ?></p>
            <h3>Porcentaje de Bajas:</h3>
            <span class="porcentaje"><?= porcentajeChurn.toFixed(1) ?>%</span>
          </div>
          <div class="tarjeta">
            <h3>Media de edad:</h3>
            <p><?= mediaEdad.toFixed(1) ?></p>
            <h3>Con contrato mensual:</h3>
            <p><?= contMensual ?></p>
            <h3>Con contrato anual:</h3>
            <p><?= contAnual ?></p>
          </div>
        </div>
      </div>
    <? } ?>
  </body>
</html>
