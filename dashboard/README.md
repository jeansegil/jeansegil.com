# AI Dashboard

Dashboard de métricas de marketing y crecimiento con insights generados por IA. Construido con HTML/CSS/JS puro + Chart.js.

## Estructura

```
dashboard/
├── index.html      → layout (sidebar, topbar, KPIs, charts, insights IA)
├── styles.css      → estilos (paleta coherente con jeansegil.com)
└── script.js       → datos demo, render de charts, generación de insights
```

## Stack

- HTML + CSS + JS vanilla (sin build step)
- [Chart.js](https://www.chartjs.org/) vía CDN para visualizaciones
- Tipografía Inter (Google Fonts)

## Cómo correrlo en local

```bash
cd dashboard
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Próximos pasos

1. **Conectar datos reales**: reemplazar `fetchMetrics()` en `script.js` con un fetch a tu API (Google Analytics, Meta Ads, etc.).
2. **Conectar IA real**: reemplazar `generateInsights()` con una llamada a la API de Claude (`claude-opus-4-7`) usando los KPIs como input.
3. **Migrar a repo propio**: cuando crees el repo `ai-dashboard` en GitHub, mover esta carpeta con `git subtree split` o copiar y hacer init nuevo.

## Migrar a repo separado

Una vez creado el repo vacío en GitHub:

```bash
# desde la raíz del repo actual
cp -r dashboard /tmp/ai-dashboard
cd /tmp/ai-dashboard
git init -b main
git add .
git commit -m "Initial commit: AI Dashboard skeleton"
git remote add origin git@github.com:jeansegil/ai-dashboard.git
git push -u origin main
```
