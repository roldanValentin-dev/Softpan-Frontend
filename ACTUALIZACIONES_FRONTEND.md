# 🔄 Actualizaciones API

## Fecha: 2 de Diciembre 2025

---

## 🌐 URL DE LA API

**Producción (Render):** `https://softpan-api.onrender.com`

**Desarrollo (Docker local):** `http://localhost:5000`

**Usuario Admin:**
- Email: `admin@gmail.com`
- Password: `admin123`

**Nota:** La API en Render duerme después de 15 minutos de inactividad. La primera petición puede tardar ~30 segundos en responder.

---

## 🆕 NUEVOS ENDPOINTS

### `GET /api/clientes/mostrador`
Cliente por defecto para ventas al público.

```json
{
  "id": 4,
  "nombre": "Cliente Mostrador",
  "tipoCliente": 0,
  "tipoClienteNombre": "Común"
}
```

### `GET /api/estadisticas/ventas/por-tipo-cliente`
Ventas por tipo de cliente del mes actual.

```json
[
  {
    "tipoCliente": 0,
    "tipoClienteNombre": "Común",
    "totalVentas": 1250.50,
    "cantidadTransacciones": 45,
    "porcentaje": 35.2
  }
]
```

### `GET /api/estadisticas/pagos/metodos`
Métodos de pago del mes actual.

```json
[
  {
    "tipoPago": 1,
    "tipoPagoNombre": "Efectivo",
    "totalCobrado": 2500.00,
    "cantidadPagos": 35,
    "porcentaje": 65.8
  }
]
```

### `GET /api/estadisticas/productos/sin-movimiento?dias=30`
Productos sin ventas en X días.
```json
[
  {
    "productoId": 25,
    "nombreProducto": "Torta de Chocolate",
    "diasSinVenta": 45,
    "ultimaVenta": "2025-10-18T10:30:00Z"
  }
]
```

### `GET /api/estadisticas/prediccion/demanda?diaSemana=3`
Predicción de producción por día de semana.

**Query:** `diaSemana` (0=Domingo, 1=Lunes, ..., 6=Sábado). Si no se envía, predice mañana.
```json
[
  {
    "productoId": 19,
    "nombreProducto": "Pan Francés",
    "diaSemana": "Miércoles",
    "promedioVentas": 180,
    "tendenciaCrecimiento": 5.2,
    "sugerenciaProduccion": 189
  }
]
```

---

## 🔄 CAMBIO EN TIPO CLIENTE

**Agregado:** `TipoCliente = 0` (Común)

**Enum actualizado:**
```
0 = Común
1 = Comercio
2 = Revendedor
```

**Implementar en:**
- Formulario de crear cliente: agregar opción "Común" con value 0
- Formulario de editar cliente: agregar opción "Común" con value 0
- Filtros de clientes: incluir tipo "Común"
