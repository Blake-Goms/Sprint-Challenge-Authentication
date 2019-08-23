const request = require('supertest');
const db = require('../database/dbConfig.js');
const server = require('./server');


let token = null;

describe('server', () => {
    // cross-env DB_ENV=testing
    it('tests are running with DB_ENV set as "testing"', () => {
        expect(process.env.DB_ENV).toBe('testing');
    }) 

    describe('POST api/auth/register', () => {
        it.skip('should insert a user into db', () => {
            //insert one
            return request(server)
            .post('/api/auth/register')
            .send({
                //change username to get a success
                username:'grey',
                password: 'goms'
            })
            .then(res => {
                //check how many are on the db again
                expect(res.status).toBe(201)
                })
        })
        it('fail when adding a user into db', () => {
            //insert one
            return request(server)
            .post('/api/auth/register')
            .send({
                username:'grey',
                password: 'goms'
            })
            .then(res => {
                //expect to fail user already in db
                expect(res.status).toBe(500)
                })
        })       
    })
    
    describe('POST api/auth/login', () => {
        it('should login a user', () => {
            //insert one
            return request(server)
            .post('/api/auth/login')
            .send({
                //change username to get a success
                username:'blake',
                password: 'goms'
            })
            .then(res => {
                //check how many are on the db again
                expect(res.status).toBe(200)
                })
        })
        it('fail when adding a user into db', () => {
            //insert one
            return request(server)
            .post('/api/auth/login')
            .send({
                username:'grey',
                password: 'goms'
            })
            .then(res => {
                //expect to fail user already in db
                expect(res.type).toMatch(/json/)
                })
        })       
    })


    describe('GET /api/jokes', () => {
        it('should get jokes', () => {
            //get jokes
            return request(server)
            .get('/api/jokes')
            .then(res => {
                //expect an unauthorized request
                expect(res.status).toBe(401)
                })
        })
        it('fail when adding a user into db', () => {
            //insert one
            return request(server)
            .get('/api/jokes')
            .then(res => {
                //expect json
                expect(res.type).toMatch(/json/)
                })
        })       
    })
})