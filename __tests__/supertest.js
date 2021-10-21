const { describe } = require('jest-circus');
const request = require('supertest');
const server = 'http:://localhost:3000';


describe('Route integration', () => {
    describe('/', () => {
        describe('GET', () => {
        //   // Note that we return the evaluation of `request` here! It evaluates to
        //   // a promise, so Jest knows not to say this test passes until that
        //   // promise resolves. See https://jestjs.io/docs/en/asynchronous
          it('responds with 202 status and application/json content type', () => {
            return request(server)
              .get('/')
              .expect('Content-Type', /text\/html/)
              .expect(200);
              console.log('yup');
          });
        });
      });
})




// request(router)
//   .get('/home/:testusername')
//   .expect(202);