export async function onRequest(context) {
  const { request, next, env } = context;

  const auth = request.headers.get('Authorization');

  if (!auth || !auth.startsWith('Basic ')) {
    return new Response('Acceso restringido. Se requiere autenticaci\u00F3n.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="N&amp;J Admin"', 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  try {
    const decoded = atob(auth.slice(6));
    const colonIndex = decoded.indexOf(':');

    if (colonIndex === -1) throw new Error('Formato inv\u00E1lido');

    const username = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);

    if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
      return new Response('Credenciales incorrectas.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="N&amp;J Admin"', 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  } catch {
    return new Response('Error de autenticaci\u00F3n.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="N&amp;J Admin"', 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  return await next();
}
