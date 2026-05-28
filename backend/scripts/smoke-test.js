const baseUrl = process.env.API_BASE || 'http://localhost:3001/api/v1';

async function req(path, options = {}) {
    const r = await fetch(baseUrl + path, {
        ...options,
        headers: { 'content-type': 'application/json', ...(options.headers || {}) }
    });
    const text = await r.text();
    let json = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = { raw: text };
    }
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} ${JSON.stringify(json)}`);
    return json;
}

async function run() {
    await req('/health');
    await req('/db/ping');

    // 先登录获取token
    const login = await req('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify({ username: 'admin', password: '123456' }) 
    });
    if (!login.data || !login.data.user || !login.data.token) throw new Error('login response invalid');
    
    const token = login.data.token;
    const tokenType = login.data.tokenType || 'Bearer';
    
    // 使用token访问受保护的API
    const users = await req('/users?pageSize=5', {
        headers: { 'Authorization': `${tokenType} ${token}` }
    });
    if (!Array.isArray(users.data)) throw new Error('users.data not array');

    process.stdout.write('Smoke test passed.\n');
}

run().catch(e => {
    process.stderr.write(String(e && e.stack ? e.stack : e) + '\n');
    process.exit(1);
});

