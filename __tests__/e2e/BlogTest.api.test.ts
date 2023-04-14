import {app} from "../../src";

const request = require('supertest');

describe('blogs API', () => {
    const correctAuthorizationHeader = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');
    const incorrectAuthorizationHeader = 'Basic ' + Buffer.from('wrong:creds').toString('base64');

    describe('GET /blogs', () => {
        it('should return a list of blogs', async () => {
            const response = await request(app).get('/blogs');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });
    describe('GET /blogs/:id', () => {
        it('should return a blog by id', async () => {
            const response = await request(app).get('/blogs/100');
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({id: '100'});
        });

        it('should return a 404 error if the blog does not exist', async () => {
            const response = await request(app).get('/blogs/123456789012345678901234');
            expect(response.status).toBe(404);
        });
    });
    describe('POST /blogs', () => {
        it('should create a new blog', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com',
            };
            const response = await request(app)
                .post('/blogs')
                .set('Authorization', correctAuthorizationHeader)
                .send(newBlog);
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newBlog);
            expect(response.body).toHaveProperty('id');
        });

        it('should return a 401 error if the user is not authorized', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com',
            };
            const response = await request(app)
                .post('/blogs')
                .set('Authorization', incorrectAuthorizationHeader)
                .send(newBlog);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should return a 400 error if the request body is invalid', async () => {
            const newBlog = {
                name: '',
                description: '',
                websiteUrl: '',
            };
            const response = await request(app)
                .post('/blogs')
                .set('Authorization', correctAuthorizationHeader)
                .send(newBlog);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errorsMessages');
        });
    });
    describe('PUT /blogs/:id', () => {
        it('should update a blog by id', async () => {
            const updatedBlog = {
                name: 'Updated Blog',
                description: 'This blog has been updated',
                websiteUrl: 'https://updatedblog.com',
            };
            const response = await request(app)
                .put('/blogs/100')
                .set('Authorization', correctAuthorizationHeader)
                .send(updatedBlog);
            expect(response.status).toBe(204);
        });

        it('should return a 401 error if the user is not authorized', async () => {
        });
    });
    describe('DELETE /blogs/:id', () => {
        it('should return 204 No Content on successful deletion of a blog', async () => {

            const deleteResponse = await request(app)
                .delete(`/blogs/100`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5');

            expect(deleteResponse.status).toBe(204);
        });

        it('should return 404 Not Found if the blog to delete does not exist', async () => {
            // delete a blog that does not exist
            const deleteResponse = await request(app)
                .delete('/blogs/123456')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5');

            expect(deleteResponse.status).toBe(404);
        });
    });
}); //// all working