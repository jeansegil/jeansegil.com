# Mis gastos — Dashboard

Dashboard de gastos personales con visualizaciones interactivas y asistente IA. Diseño exportado desde Claude Design.

## Archivos

- `index.html` — entry point del dashboard (copia exacta del diseño aprobado)
- `Dashboard de Gastos.dc.html` — el archivo original de Claude Design, conservado por referencia
- `README.md` — este documento

Todo el dashboard es **un único archivo self-contained** (HTML + CSS + JS inline). No hay build step, no hay dependencias locales.

## Qué hace

- Lee movimientos desde una hoja de Google Sheets pública
- KPIs: total gastado, débito, crédito, promedio diario, delta vs período anterior
- Gráfico semanal (débito + crédito apilados, clickable)
- Donut débito vs crédito
- Ranking de categorías con barras, clickable
- Heatmap de día de la semana
- Tarjetas por banco (BCP, BBVA, Interbank, SIP)
- Lista de movimientos (recientes / mayores)
- Filtros encadenables: tipo, banco, categoría, día semana, semana, rango de fechas
- Chips de filtros activos con "limpiar todo"
- Toggle modo claro / oscuro
- Chat IA flotante con preguntas sugeridas

## Fuente de datos

```
SHEET_ID:   1wuG1ufBPFv4N63NK-gTSgGi47j6k8qOVFhQkaWXPmrE
SHEET_NAME: Gastos Mayo-Junio 2026
```

La hoja debe ser pública (accesible vía `gviz/tq` API). Columnas esperadas:

| Col | Campo |
|-----|-------|
| A   | Fecha (dd/mm/yyyy) |
| B   | Hora |
| C   | Moneda (`Soles` / `Dólares`) |
| D   | Monto |
| E   | Banco |
| F   | Tipo (`Débito` / `Crédito`) |
| G   | Código |
| H   | Destino / comercio |
| I   | Categoría |
| J   | Fuente (`Claude` marca los registros auto) |

Tipo de cambio fijo en código: `USD_TO_SOL = 3.78`.

## Chat IA — pendiente

El chat hace `fetch` directo a `https://api.anthropic.com/v1/messages` desde el navegador. Esto **no funciona en producción** por dos razones:

1. **Falta auth** — no se envía `x-api-key`. Una API key pública en el cliente es un riesgo de seguridad de todos modos.
2. **CORS** — Anthropic bloquea llamadas desde browser sin el header `anthropic-dangerous-direct-browser-access` (y aún así requiere key).

**Solución correcta**: meter un proxy en el medio. Opciones:

- **Netlify / Vercel Function** (`/api/chat`) que reciba el mensaje, agregue el `x-api-key` desde una env var, y reenvíe a Anthropic.
- **Cloudflare Worker** equivalente.

En el código está marcado con `fetch('https://api.anthropic.com/v1/messages', …)` dentro de `sendChat()`. Cambiar la URL al endpoint del proxy una vez creado.

## Correr en local

```bash
cd dashboard
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Deploy

Cualquier hosting de estáticos funciona:

- **Netlify**: arrastrar la carpeta `/dashboard` al dashboard de Netlify
- **GitHub Pages**: habilitar Pages apuntando al directorio `/dashboard`
- **Vercel**: import del repo, root directory `dashboard`

## Migración al repo separado

El repo `jeansegil/dashboard_misgastos` ya existe en GitHub. Para mover esta carpeta ahí (manteniendo solo este dashboard):

```bash
cp -r /home/user/jeansegil.com/dashboard /tmp/dashboard_misgastos
cd /tmp/dashboard_misgastos
git init -b main
git add .
git commit -m "Initial commit: Mis gastos dashboard"
git remote add origin git@github.com:jeansegil/dashboard_misgastos.git
git push -u origin main
```
