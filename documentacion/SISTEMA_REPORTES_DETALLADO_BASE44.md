# 📊 SISTEMA DE REPORTES DETALLADO
## PropDash Analytics - Base44

---

## 🎯 ESTRUCTURA GENERAL DE REPORTES

Cada módulo debe tener:
- **3 Reportes predefinidos** (hecho por ti)
- **1 Opción de reporte a medida** (generado por usuario)
- **Previsualización** antes de descargar
- **Descarga en 3 formatos:** PDF, Excel, CSV

---

## 📈 MÓDULO FINANZAS - REPORTES

### Reporte 1: "Resumen Mensual de Ingresos"

#### Datos a mostrar:
```
Período: Mes seleccionado
├─ Ingresos totales: $2,400,000
├─ Ingresos por categoría:
│  ├─ Ventas residencial: $1,500,000 (62%)
│  ├─ Ventas comercial: $650,000 (27%)
│  └─ Servicios y comisiones: $250,000 (11%)
├─ Comparativa mes anterior:
│  ├─ Mes actual: $2,400,000
│  ├─ Mes anterior: $2,140,000
│  └─ Variación: +12% ↑
└─ Proyección próximo mes: $2,650,000
```

#### Visualización previa:
- Tabla con categorías de ingresos
- Gráfico de pastel con porcentajes
- Gráfico de barras comparativo (mes actual vs anterior)
- Cards de resumen

#### Campos personalizables (para reporte a medida):
- Rango de fechas
- Categorías a incluir
- Mostrar comparativa (sí/no)
- Incluir proyección (sí/no)

---

### Reporte 2: "Análisis de Gastos"

#### Datos a mostrar:
```
Período: Mes seleccionado
├─ Gastos totales: $480,000
├─ Gastos por categoría:
│  ├─ Nómina y salarios: $250,000 (52%)
│  ├─ Servicios e infraestructura: $120,000 (25%)
│  ├─ Marketing y publicidad: $80,000 (17%)
│  └─ Otros gastos: $30,000 (6%)
├─ Gasto promedio por día: $15,483
├─ Comparativa mes anterior:
│  └─ Variación: -3% ↓ (optimizado)
└─ Presupuesto vs Real:
   ├─ Presupuesto: $500,000
   ├─ Real: $480,000
   └─ Ahorro: $20,000 (4%)
```

#### Visualización previa:
- Tabla de gastos por categoría
- Gráfico de pastel (distribución)
- Gráfico de barras (comparativa presupuesto vs real)
- Timeline de gastos por día

#### Campos personalizables:
- Rango de fechas
- Categorías a incluir
- Mostrar presupuesto (sí/no)
- Desglose diario (sí/no)

---

### Reporte 3: "Flujo de Caja"

#### Datos a mostrar:
```
Período: Trimestre/Año seleccionado
├─ Entradas de caja:
│  ├─ Mes 1: $2,400,000
│  ├─ Mes 2: $2,350,000
│  └─ Mes 3: $2,520,000
│  └─ Total: $7,270,000
├─ Salidas de caja:
│  ├─ Mes 1: $480,000
│  ├─ Mes 2: $485,000
│  └─ Mes 3: $490,000
│  └─ Total: $1,455,000
├─ Flujo neto:
│  ├─ Mes 1: $1,920,000
│  ├─ Mes 2: $1,865,000
│  └─ Mes 3: $2,030,000
│  └─ Total: $5,815,000
└─ Saldo final acumulado: $5,815,000
```

#### Visualización previa:
- Tabla con 3 columnas (mes, entradas, salidas, flujo neto)
- Gráfico de línea con tendencia
- Gráfico de barras apiladas (entradas vs salidas)
- Tarjetas de resumen (total entradas, salidas, flujo neto)

#### Campos personalizables:
- Rango de fechas (mes/trimestre/año)
- Incluir proyecciones (sí/no)
- Nivel de detalle (resumido/detallado)

---

## 🏠 MÓDULO COMERCIAL - REPORTES

### Reporte 1: "Propiedades Vendidas"

#### Datos a mostrar:
```
Período: Mes seleccionado
├─ Total propiedades vendidas: 24
├─ Valor total de ventas: $18,500,000
├─ Precio promedio: $770,833
├─ Desglose por tipo:
│  ├─ Residencial: 18 propiedades ($13,500,000)
│  ├─ Comercial: 4 propiedades ($3,200,000)
│  └─ Terrenos: 2 propiedades ($1,800,000)
├─ Top 3 vendedores:
│  ├─ Carlos Pérez: 7 ventas ($5,200,000)
│  ├─ Sofía García: 6 ventas ($4,800,000)
│  └─ Juan López: 5 ventas ($4,100,000)
└─ Tiempo promedio de cierre: 45 días
```

#### Visualización previa:
- Tabla de propiedades vendidas con detalles
- Gráfico de barras (vendedores top)
- Gráfico de pastel (distribución por tipo)
- Cards de métricas principales

#### Campos personalizables:
- Rango de fechas
- Filtro por tipo de propiedad
- Incluir vendedores (sí/no)
- Mostrar tiempo de cierre (sí/no)

---

### Reporte 2: "Pipeline de Ventas"

#### Datos a mostrar:
```
Estado del Pipeline:
├─ Prospectación: 45 propiedades ($28,500,000 potencial)
├─ Negociación: 32 propiedades ($22,400,000 potencial)
├─ Pre-cierre: 15 propiedades ($10,200,000 potencial)
├─ En cierre: 8 propiedades ($5,600,000 potencial)
└─ Cerradas (mes actual): 24 propiedades ($18,500,000)

├─ Tasa de conversión:
│  ├─ Prospectación → Negociación: 71%
│  ├─ Negociación → Pre-cierre: 47%
│  ├─ Pre-cierre → Cierre: 53%
│  └─ Cierre total: 18%
└─ Valor promedio por etapa:
   ├─ Prospectación: $633,333
   ├─ Negociación: $700,000
   ├─ Pre-cierre: $680,000
   └─ En cierre: $700,000
```

#### Visualización previa:
- Gráfico de embudo de ventas (Funnel)
- Tabla con estadísticas por etapa
- Gráfico de línea (evolución del pipeline)
- Métricas de conversión

#### Campos personalizables:
- Mostrar por vendedor (sí/no)
- Incluir proyecciones (sí/no)
- Filtro por tipo de propiedad

---

### Reporte 3: "Análisis de Cartera"

#### Datos a mostrar:
```
Cartera activa: 142 propiedades
├─ Por zona:
│  ├─ Zona Centro: 28 propiedades ($18,900,000)
│  ├─ Zona Norte: 35 propiedades ($22,100,000)
│  ├─ Zona Sur: 42 propiedades ($28,200,000)
│  └─ Zona Este: 37 propiedades ($19,800,000)
├─ Por tipo:
│  ├─ Residencial: 85 propiedades ($57,450,000)
│  ├─ Comercial: 35 propiedades ($20,650,000)
│  └─ Terrenos: 22 propiedades ($11,500,000)
├─ Por antigüedad en cartera:
│  ├─ Menos de 30 días: 38 propiedades
│  ├─ 30-90 días: 52 propiedades
│  ├─ 90-180 días: 38 propiedades
│  └─ Más de 180 días: 14 propiedades
└─ Valor total cartera: $89,600,000
```

#### Visualización previa:
- Mapa con distribución por zonas
- Gráfico de barras (por tipo de propiedad)
- Tabla con propiedades listadas
- Histograma de antigüedad

#### Campos personalizables:
- Filtro por zona
- Filtro por tipo
- Mostrar solo activas (sí/no)
- Rango de antigüedad

---

## 📢 MÓDULO MARKETING - REPORTES

### Reporte 1: "Generación de Leads"

#### Datos a mostrar:
```
Período: Mes seleccionado
├─ Total leads generados: 847
├─ Por canal:
│  ├─ Google Ads: 245 leads (29%) | Costo: $8,575
│  ├─ Facebook/Instagram: 312 leads (37%) | Costo: $7,488
│  ├─ Email marketing: 156 leads (18%) | Costo: $1,560
│  ├─ Referidos: 89 leads (11%) | Costo: $0
│  └─ Otros: 45 leads (5%) | Costo: $2,250
├─ Costo promedio por lead: $145
├─ Leads calificados: 347 (41%)
├─ Leads convertidos a clientes: 24 (7%)
└─ Conversión promedio: 2.8%
```

#### Visualización previa:
- Gráfico de pastel (distribución por canal)
- Tabla con costos y leads por canal
- Gráfico de barras (leads calificados vs convertidos)
- Metrics cards (leads totales, costo, conversión)

#### Campos personalizables:
- Rango de fechas
- Filtro por canal
- Mostrar costos (sí/no)
- Mostrar conversiones (sí/no)

---

### Reporte 2: "ROI de Campañas"

#### Datos a mostrar:
```
Período: Mes seleccionado
├─ Campaña: "Verano 2026"
│  ├─ Inversión: $12,000
│  ├─ Leads generados: 285
│  ├─ Conversiones: 8
│  ├─ Ingresos generados: $6,160,000
│  └─ ROI: 5,033% ↑ EXCELENTE
├─ Campaña: "Propiedades Comerciales"
│  ├─ Inversión: $8,500
│  ├─ Leads generados: 162
│  ├─ Conversiones: 5
│  ├─ Ingresos generados: $3,850,000
│  └─ ROI: 45,194% ↑ EXCELENTE
└─ Resumen general:
   ├─ Inversión total: $45,000
   ├─ Ingresos generados: $18,500,000
   ├─ ROI promedio: 41,067%
   └─ Costo por conversión: $1,875
```

#### Visualización previa:
- Tabla comparativa de campañas
- Gráfico de línea (ROI tendencia)
- Gráfico de barras (inversión vs ingresos)
- Cards de KPIs principales

#### Campos personalizables:
- Rango de fechas
- Filtro por campaña
- Incluir análisis competitivo (sí/no)
- Proyecciones (sí/no)

---

### Reporte 3: "Análisis de Audiencia"

#### Datos a mostrar:
```
Segmentación demográfica:
├─ Por edad:
│  ├─ 25-34 años: 312 leads (37%)
│  ├─ 35-44 años: 267 leads (32%)
│  ├─ 45-54 años: 198 leads (23%)
│  └─ 55+ años: 70 leads (8%)
├─ Por género:
│  ├─ Masculino: 489 leads (58%)
│  └─ Femenino: 358 leads (42%)
├─ Por intención de compra:
│  ├─ Inversor: 245 leads (29%)
│  ├─ Vivienda principal: 412 leads (49%)
│  └─ Segunda vivienda: 190 leads (22%)
└─ Engagement:
   ├─ Click rate: 12.5%
   ├─ Open rate (email): 28.3%
   └─ Conversión a llamada: 34.7%
```

#### Visualización previa:
- Gráficos de distribución (edad, género)
- Tabla de intención de compra
- Gráfico de barras (engagement por canal)
- Heatmap de segmentación

#### Campos personalizables:
- Rango de fechas
- Segmento a analizar
- Incluir benchmark (sí/no)
- Nivel de detalle

---

## 👑 MÓDULO VALOR EMPRESA - REPORTES (Solo Admin)

### Reporte 1: "Valuación Empresarial"

#### Datos a mostrar:
```
Período: Año seleccionado
├─ Valuación actual: $125,000,000
├─ Variación anual: +18% ↑
├─ Comparativa 5 años:
│  ├─ 2022: $84,500,000
│  ├─ 2023: $105,500,000
│  ├─ 2024: $125,000,000
│  └─ Crecimiento acumulado: 48%
├─ Métricas de valuación:
│  ├─ EV / EBITDA: 4.4x (rango óptimo: 4-5x)
│  ├─ EV / Ingresos: 4.3x
│  ├─ EV / Utilidades: 16.2x
│  └─ Múltiplo industria: 4.2x
└─ Benchmarking:
   ├─ Nuestra empresa: $125M
   ├─ Competidor A: $118M
   ├─ Competidor B: $132M
   └─ Promedio industria: $121M
```

#### Visualización previa:
- Gráfico de línea (valuación en 5 años)
- Tabla de múltiplos
- Gráfico de barras (comparativa benchmarking)
- Cards de valuación actual y proyectada

#### Campos personalizables:
- Rango de años
- Incluir benchmarking (sí/no)
- Incluir proyecciones (sí/no)

---

### Reporte 2: "EBITDA y Rentabilidad"

#### Datos a mostrar:
```
Período: Año seleccionado
├─ EBITDA:
│  ├─ 2022: $14,200,000
│  ├─ 2023: $22,100,000
│  ├─ 2024: $28,500,000
│  └─ Margen EBITDA: 22.1%
├─ Utilidades netas:
│  ├─ 2022: $8,600,000
│  ├─ 2023: $15,800,000
│  ├─ 2024: $22,300,000
│  └─ Margen neto: 17.3%
├─ Ratios de rentabilidad:
│  ├─ ROE (Rentabilidad sobre capital): 22.7%
│  ├─ ROA (Rentabilidad sobre activos): 15.3%
│  └─ Margen bruto: 34.2%
└─ Análisis histórico:
   ├─ Crecimiento EBITDA (3 años): 100.7%
   ├─ Crecimiento utilidades (3 años): 159.3%
   └─ Tendencia: POSITIVA ↑
```

#### Visualización previa:
- Gráfico de línea (EBITDA y utilidades en 5 años)
- Tabla de márgenes
- Gráfico de barras (ROE y ROA)
- Cards de ratios principales

#### Campos personalizables:
- Rango de años
- Incluir análisis detallado (sí/no)
- Mostrar proyecciones (sí/no)

---

### Reporte 3: "Indicadores Accionistas"

#### Datos a mostrar:
```
Año: 2024
├─ Dividendos distribuidos:
│  ├─ Total: $8,900,000
│  ├─ Por acción: $8.90
│  ├─ Payout ratio: 39.9%
│  └─ Dividend yield: 7.1%
├─ Valor de la acción:
│  ├─ Precio actual: $1,250
│  ├─ Precio 12 meses atrás: $1,058
│  ├─ Variación: +18.2% ↑
│  └─ P/E ratio: 50.2x
├─ Indicadores clave:
│  ├─ EPS (Ganancias por acción): $24.90
│  ├─ Book value per share: $55.10
│  ├─ Price to book: 22.7x
│  └─ Deuda/Equity: 0.35
└─ Proyecciones 2025:
   ├─ EPS esperado: $28.50
   ├─ Dividendo esperado: $10.20
   └─ Precio objetivo: $1,475
```

#### Visualización previa:
- Tabla de indicadores
- Gráfico de línea (precio de acción en 12 meses)
- Gráfico de barras (dividendos históricos)
- Cards de EPS y dividendo por acción

#### Campos personalizables:
- Año a analizar
- Incluir proyecciones (sí/no)
- Mostrar análisis comparativo (sí/no)

---

## 🎯 SISTEMA DE REPORTES A MEDIDA

El usuario puede crear un reporte personalizado seleccionando:

1. **Tipo de reporte:**
   - Resumen (gráficos principales)
   - Detallado (con tablas completas)
   - Ejecutivo (1-2 páginas)

2. **Datos a incluir:**
   - Seleccionar checkboxes de métricas disponibles
   - Seleccionar rango de fechas
   - Aplicar filtros (por zona, tipo, categoría, etc.)

3. **Formato de salida:**
   - PDF (con logo, formato profesional)
   - Excel (con gráficos incrustados)
   - CSV (para importar a otras herramientas)

4. **Previsualización:**
   - Ver cómo se vería el reporte antes de descargar
   - Hacer ajustes finales
   - Confirmar descarga

---

## 💾 ESPECIFICACIONES DE DESCARGA

### PDF
```
├─ Encabezado: Logo + Nombre de la app
├─ Título del reporte
├─ Fecha de generación + Usuario
├─ Tabla de contenidos
├─ Cuerpo del reporte:
│  ├─ Introducción/Resumen ejecutivo
│  ├─ Datos y tablas
│  ├─ Gráficos
│  └─ Conclusiones
├─ Pie de página: Número de página + Fecha
└─ Tamaño: A4 | Color: CMYK
```

### EXCEL
```
├─ Hoja 1: "Resumen" con gráficos
├─ Hoja 2: "Datos" con tablas completas
├─ Hoja 3: "Análisis" con métricas
├─ Formato:
│  ├─ Encabezados en azul oscuro
│  ├─ Datos con formato profesional
│  ├─ Gráficos embebidos
│  └─ Fórmulas donde sea relevante
└─ Archivo: "Reporte_[Módulo]_[Fecha].xlsx"
```

### CSV
```
├─ Separador: Comas
├─ Codificación: UTF-8
├─ Estructura: Fila 1 = Encabezados
├─ Datos: Todos los registros
└─ Archivo: "Reporte_[Módulo]_[Fecha].csv"
```

---

## 📌 NOTAS IMPORTANTES

1. **Datos ficticios realistas:** Todos los números deben ser creíbles para una inmobiliaria
2. **Formato profesional:** Todos los reportes deben verse ejecutivos
3. **Incluir logos:** Adicionar logo de empresa en PDFs
4. **Responsivo:** Los reportes deben verse bien en cualquier resolución
5. **Performance:** Las descargas deben ser rápidas
6. **Versionado:** Permitir guardar reportes generados

---

**Documento actualizado:** Junio 2026
**Estado:** Listo para implementar en Base44

