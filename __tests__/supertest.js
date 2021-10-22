const { describe } = require('jest-circus');
const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const server = 'http://localhost:3000';



describe('Route integration', () => {
    describe('POST', () => {
      const buckit = {
        title: 'testBuckit',
        description: 'this is a test',
        url: 'www.test.com',
        rating: 5,
        user_id:'testuserID'
      }
        //   // Note that we return the evaluation of `request` here! It evaluates to
        //   // a promise, so Jest knows not to say this test passes until that
        //   // promise resolves. See https://jestjs.io/docs/en/asynchronous
          it('responds with 203 status and application/json content type', () => {
            return request(server)
              .post("/api/addBuckit")
              .send(buckit)
              .expect('Content-Type', /application\/json/)
              .expect(203)
              // .then(({ body }) => {
              //   console.log(body);
              //   expect(body).toHaveProperty('title');
              // }, done);
          });
      });
})




// request(router)
//   .get('/home/:testusername')
//   .expect(202);