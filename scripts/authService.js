const apiKey = 'AIzaSyBCjOx2JImMif48ZgbPGX4Gi34ajS8e0pI';
const baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';

const endpoints = {
    login: baseUrl + 'signInWithPassword?key=' + apiKey,
    register: baseUrl + 'signUp?key=' + apiKey,
}

const auth = {
    login,
    register,
    getUserData,
}

async function login(email, password) {
    let res = await fetch(endpoints.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    })

    let data = await res.json();

    return data;
}

async function register(email, password) {
    let res = await fetch(endpoints.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    })

    let data = await res.json();

    return data;
}

function getUserData() {
    return localStorage['auth'] ? JSON.parse(localStorage['auth']) : '';
}