const axios = require('axios'); // assuming axios is not installed in server, I might need to run this from a place where it is, or use fetch.
// Let's use fetch which is native in recent node.

async function testAuth() {
    const baseUrl = 'http://localhost:5000/api/auth';
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const user = {
        name: 'Test User',
        email,
        password,
        role: 'Student'
    };

    console.log(`Attempting to register with email: ${email}`);
    try {
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const regData = await regRes.json();
        console.log(`Register Status: ${regRes.status}`);
        console.log('Register Response:', regRes.status === 200 ? 'Success' : regData);

        if (regRes.status === 200) {
            console.log('\nAttempting to login...');
            const loginRes = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const loginData = await loginRes.json();
            console.log(`Login Status: ${loginRes.status}`);
            console.log('Login Response:', loginRes.status === 200 ? 'Success' : loginData);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

testAuth();
