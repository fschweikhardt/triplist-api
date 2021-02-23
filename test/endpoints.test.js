const supertest = require('supertest');
// const { request } = require('../src/app');
const app = require('../src/app')

describe('GET /', () => {
    it('respond with Hello, TripList!', () => {
        return supertest(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200, 'Hello, TripList!');
    });
});

let token = ''

// beforeAll( done => { 
//     return supertest(app) 
//         .post('/login')
//         .send({
//             username: 'demo',
//             password: 'demo'
//         })
//         .end((err, response) => {
//             token = response.body.token
//             done()  
//         })
// })

console.log('demo token', token)
