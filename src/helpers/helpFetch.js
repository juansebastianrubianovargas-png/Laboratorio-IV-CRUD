export const helpFetch = () => {
  const customFetch = async (endpoint, { body, ...options } = {}) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {})
      });
      if (!response.ok) throw new Error(`No se pudo completar la solicitud (${response.status}).`);
      return response.status === 204 ? null : await response.json();
    } catch (error) {
      return { error: true, message: error.message === 'Failed to fetch'
        ? 'No hay conexión con la API. Revisa que npm run dev siga en ejecución.' : error.message };
    }
  };
  return {
    get: (endpoint, options) => customFetch(endpoint, options),
    post: (endpoint, body) => customFetch(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => customFetch(endpoint, { method: 'PUT', body }),
    del: endpoint => customFetch(endpoint, { method: 'DELETE' })
  };
};
