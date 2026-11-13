# VPS · Anotar ventas

App de repartidores que funciona sin internet. Las ventas se guardan en el celular y se suben solas a la hoja cuando regresa la señal.

- `index.html`: la app.
- `sw.js`: la guarda en el celular para que abra sin señal. **Al cambiar la app, sube `VERSION`.**
- Habla con la app de Google (Apps Script) de repartidores por `doPost`.
