const supertest = require('supertest')
const app = require('../src/app')

describe('GET /', () => {
    it('respond with Hello, TripList!', () => {
        return supertest(app)
            .get('/')
            .expect('Hello, TripList!')
            .expect(200);
    })
    it('respond 404', () => {
        return supertest(app)
            .get('/err')
            .expect(404)
    })
    it('should respond working', () => {
        return supertest(app)
            .get('/api/test')
            .expect(200, 'working')
    })
})

describe('POST /api/login', () => {
    it('should respond with JWT token', () => {
        return supertest(app)
            .post('/api/login')
            .send({
                "username": "demo",
                "password": "demo"
            })
            .expect(200)
    })
    it('should fail with incorrect password', () => {
        return supertest(app)
            .post('/api/login')
            .send({
                "username": "demo",
                "password": "bad password"
            })
            .expect(401)
    })
})

// let token = ''

// before( done => { 
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

// console.log('log demo token:', token)
