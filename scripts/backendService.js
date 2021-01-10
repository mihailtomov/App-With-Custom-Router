const backendUrl = 'https://testapp-ef379.firebaseio.com/';

const request = {
    getAll,
    getOne,
    post,
}

async function getOne(collection, itemId) {
    let res = await fetch(backendUrl + collection + `/${itemId}` + '.json');

    let data = await res.json();

    return data;
}

async function getAll(collection) {
    let res = await fetch(backendUrl + collection + '.json');

    let data = await res.json();

    return data;
}

async function post(collection, dataObj) {
    let res = await fetch(backendUrl + collection + '.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    })

    let data = await res.json();

    return data;
}