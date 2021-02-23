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


    // UsersRouter
    // .route('/api/login')
    // .post(bodyParser, (req,res,next) => {
    //     const { username, password } = req.body
    // ...etc...

    it.only('should fail with incorrect password', () => {
        return supertest(app)
            .post('/api/login')
            .send({
                username: "demo",
                password: "bad"
            })
            .expect(401)
    })
})

describe('GET /api/verify routes', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW8iLCJpYXQiOjE2MTQwOTY3Mzh9.M6eWaIVMMsBSwa1zS6ySNx56aZks-OiBQiRnDVD6AYA'
    it('verifyId, should return 200', () => {
        return supertest(app)
            .get('/api/verifyId')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    })
    it('verifyLists, should return 200', () => {
        return supertest(app)
            .get('/api/verifyId')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    })
    it('verifyItems, should return 200', () => {
        return supertest(app)
            .get('/api/verifyId')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
    })
})

describe('users lists', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW8iLCJpYXQiOjE2MTQwOTY3Mzh9.M6eWaIVMMsBSwa1zS6ySNx56aZks-OiBQiRnDVD6AYA'
    it('POST adds list', () => {
        return supertest(app)
            .get('/api/lists')
            .set('Authorization', 'Bearer ' + token)
            .send({"title": "new list"})
            .expect(201)
    })
})


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
