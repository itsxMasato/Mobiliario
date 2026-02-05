// Detectar ambiente y usar URL correcta. Usar ruta relativa por defecto para desarrollo local
const BASE_URL = process.env.REACT_APP_API_URL || "/api/mobiliario";

async function parseResponse(res) {
  if (res.status === 204) return null; // no hay cuerpo
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function getMobiliario() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al cargar mobiliario: " + res.status);
  return parseResponse(res);
}

export async function crearMobiliario(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error creando mobiliario");
  }

  return parseResponse(res);
}

export async function actualizarMobiliario(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error actualizando mobiliario");
  }

  return parseResponse(res);
}

export async function eliminarMobiliario(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error eliminando mobiliario");
  }

  return parseResponse(res);
}