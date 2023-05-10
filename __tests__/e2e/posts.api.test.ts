import { app } from '../../src';

const request = require('supertest');

describe('posts API', () => {
  const correctAuthorizationHeader = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');
  const incorrectAuthorizationHeader = 'Basic ' + Buffer.from('wrong:creds').toString('base64');

  describe('GET /posts', () => {
    it('should return a list of posts', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  }); /// R
  describe('GET /posts/:id', () => {
    it('should return a post by id', async () => {
      const response = await request(app).get('/posts/100');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: '100' });
    });

    it('should return a 404 error if the blog does not exist', async () => {
      const response = await request(app).get('/blogs/123456789012345678901234');
      expect(response.status).toBe(404);
    });
  }); /// R
  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'mongoDBTest',
        shortDescription: 'testShortDescription',
        content: 'testContent',
        blogId: '101',
      };
      const response = await request(app).post('/posts').set('Authorization', correctAuthorizationHeader).send(newPost);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newPost);
    });

    it('should return a 401 error if the user is not authorized', async () => {
      const newBlog = {
        name: 'Test Blog',
        description: 'This is a test blog',
        websiteUrl: 'https://testblog.com',
      };
      const response = await request(app).post('/blogs').set('Authorization', incorrectAuthorizationHeader).send(newBlog);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return a 400 error if the request body is invalid', async () => {
      const newBlog = {
        name: '',
        description: '',
        websiteUrl: '',
      };
      const response = await request(app).post('/blogs').set('Authorization', correctAuthorizationHeader).send(newBlog);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errorsMessages');
    });
  }); /// R
  describe('PUT /posts/:id', () => {
    it('should update a posts by id', async () => {
      const updatedPost = {
        title: 'UpdatedPost',
        shortDescription: 'ivandec',
        content: 'https://www.youtube.com',
        blogId: '101',
      };
      const response = await request(app).put('/posts/100').set('Authorization', correctAuthorizationHeader).send(updatedPost);
      expect(response.status).toBe(204);
    });

    it('should return a 401 error if the user is not authorized', async () => {});
  }); /// R
  describe('DELETE /blpostsogs/:id', () => {
    it('should return 204 No Content on successful deletion of a post', async () => {
      const deleteResponse = await request(app).delete(`/posts/100`).set('Authorization', 'Basic YWRtaW46cXdlcnR5');

      expect(deleteResponse.status).toBe(204);
    });

    it('should return 404 Not Found if the post to delete does not exist', async () => {
      // delete a blog that does not exist
      const deleteResponse = await request(app).delete('/blogs/123456').set('Authorization', 'Basic YWRtaW46cXdlcnR5');

      expect(deleteResponse.status).toBe(404);
    });
  }); /////// R
});
