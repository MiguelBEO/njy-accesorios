export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith('/admin')) {
      return env.ASSETS.fetch(request);
    }

    const auth = request.headers.get('Authorization');

    if (!auth || !auth.startsWith('Basic ')) {
      return new Response('Acceso restringido. Se requiere autenticaci\u00f3n.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="N&J Admin"',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    try {
      const decoded = atob(auth.slice(6));
      const colonIndex = decoded.indexOf(':');

      if (colonIndex === -1) throw new Error('Formato inv\u00e1lido');

      const username = decoded.substring(0, colonIndex);
      const password = decoded.substring(colonIndex + 1);

      if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
        throw new Error('Credenciales incorrectas');
      }
    } catch {
      return new Response('Credenciales incorrectas.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="N&J Admin"',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
