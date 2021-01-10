const container = document.getElementById('container');

const routes = {
    '/home': 'home-template',
    '/login': 'login-template',
    '/register': 'register-template',
    '/create-movie': 'create-template',
    '/details': 'details-template',
    '/edit': 'edit-template',
}

redirect('/home');

function registerPartials() {
    let headerSrc = document.getElementById('header-template').innerHTML;
    let footerSrc = document.getElementById('footer-template').innerHTML;
    let movieSrc = document.getElementById('movie-template').innerHTML;

    Handlebars.registerPartial('header', headerSrc);
    Handlebars.registerPartial('footer', footerSrc);
    Handlebars.registerPartial('movie', movieSrc);
}

// get path from anchor links
function onLinkClick(e) {
    if (e.target.tagName == 'A' || e.target.classList.contains('btn-info')) {
        e.preventDefault();
        
        let path;

        if (e.target.tagName == 'BUTTON' ? 
        !e.target.parentElement.href.split('/').length > 4 : 
        !e.target.href.split('/').length > 4) {
            path = new URL(e.target.href).pathname;
        } else {
            if (e.target.parentElement.href) {
                path = '/' + e.target.parentElement.href.split('/').splice(3, 2).join('/');
            } else {
                path = '/' + e.target.href.split('/').splice(3, 2).join('/');
            }
        }

        redirect(path);
    }
}

//change path in web address bar
function redirect(path) {
    history.pushState({}, '', path);

    router(path);
}

//render template corresponding to path
async function router(path) {
    registerPartials();

    let movieId;

    if (path.split('/')[1] != '') {
        movieId = path.split('/')[2];
        path = '/' + path.split('/')[1];
    }

    let loggedIn;
    let email;
    let author;

    if (auth.getUserData()) {
        loggedIn = true;
        email = auth.getUserData().email;
    } else {
        loggedIn = false;
        email = '';
    }

    let movies = [];
    let movie = null;

    switch (path) {
        case '/home':
            let data = await request.getAll('movies');

            if (data) {
                movies = Object.keys(data).map(key => { return { id: key, ...data[key] } });
            }
            break;
        case '/details':
            let movieData = await request.getOne('movies', movieId);
            movie = { id: movieId, ...movieData };

            auth.getUserData().localId == movieData.creator ? author = true : author = false;
            break;
    }

    if (routes[path]) {
        container.innerHTML = Handlebars.compile(document.getElementById(routes[path]).innerHTML)({ loggedIn, email, movies, movie, author });
    }

    logEvents(path);
}

function logEvents(path) {
    switch (path) {
        case '/register':
            document.getElementById('register-btn').addEventListener('click', registerHandler);
            break;
        case '/login':
            document.getElementById('login-btn').addEventListener('click', loginHandler);
            break;
        case '/create-movie':
            document.getElementById('create-btn').addEventListener('click', createHandler);
            break;
        case '/logout':
            localStorage['auth'] = '';
            redirect('/home');
            break;
    }
}

async function registerHandler(e) {
    e.preventDefault();

    let formData = new FormData(document.forms['register-form']);

    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    const validatePasswords = password === repeatPassword;

    if (email && validatePasswords) {
        let data = await auth.register(email, password);

        localStorage.setItem('auth', JSON.stringify(data));

        redirect('/home');
    }
}

async function loginHandler(e) {
    e.preventDefault();

    let formData = new FormData(document.forms['login-form']);

    const email = formData.get('email');
    const password = formData.get('password');

    let data = await auth.login(email, password);

    localStorage.setItem('auth', JSON.stringify(data));

    redirect('/home');
}

async function createHandler(e) {
    e.preventDefault();

    let uid = auth.getUserData().localId;

    let formData = new FormData(document.forms['create-form']);

    const title = formData.get('title');
    const description = formData.get('description');
    const imageUrl = formData.get('imageUrl');

    const likes = new Array();

    if (title && description && imageUrl) {
        let dataObj = { title, description, imageUrl, creator: uid, likes };

        let data = await request.post('movies', dataObj);

        redirect('/home');
    }
}