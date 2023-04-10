import request from 'supertest'

import {app} from '../../src'




describe('getAllBlogs endpoint', () => {

    it('should all blogs', async () => {
        const response = await request(app).get('/blogs');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual([]);
    });
}); ///ready

describe('getBlogById endpoint', () => {

    it('should return existent blog by id', async () => {
        const response = await request(app).get('/blogs/test');
        expect(response.status).toEqual(200);
        const expectedBody = {
            id: 'test',
            name: 'testName',
            description: 'testDescription',
            websiteUrl: 'testWebsiteUrl',
        };
        const responseBody = JSON.parse(response.text);
        expect(responseBody).toEqual(expectedBody);
    });


    it('should return a 404 for non-existent blog id', async () => {
        const response = await request(app).get('/blogs/999');
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Blog not found');
    });
}); /// ready

describe('createNewBlog endpoint', () => {
    it('should create a new blog', async () => {
        const newBlog = {
            id: 'testPost',
            name: 'testName',
            description: 'testDescription',
            websiteUrl: 'https://chat.openai.com',
        };
        const response = await request(app).post('/blogs').send(newBlog);
        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            id: 'testPost',
            name: 'testName',
            description: 'testDescription',
            websiteUrl: 'https://chat.openai.com',
        });
    });

    it('should return a 400 for invalid blog data', async () => {
        const invalidBlog = { title: 'Invalid Blog Post' };
        const response = await request(app).post('/blogs').send(invalidBlog);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errorsMessages: [
                {"field": "name", "message": "name max length 15"},
                {"field": "description","message": "description max length 500"},
                {"field": "websiteUrl", "message": "websiteUrl max length 100",}],
        });
    });
});  /// ready

describe('deleteBlogById endpoint', () => {
    it('should delete a blog by id', async () => {
        const response = await request(app).delete('/blogs/test');
        expect(response.status).toEqual(204);
    });

    it('should return a 404 for non-existent blog id', async () => {
        const response = await request(app).delete('/blogs/999');
        expect(response.status).toEqual(404);
    });
}); /// ready

describe('updateBlogById endpoint', () => {
    it('should update a blog by id', async () => {
        const updatedBlog = {
            id: 'testPostNew',
            name: 'testName',
            description: 'testDescription',
            websiteUrl: 'https://chat.openai.com',
        };
        const response = await request(app).put('/blogs/test').send(updatedBlog);
        expect(response.status).toEqual(204);
    });

    it('should return a 404 for non-existent blog id', async () => {
        const updatedBlog = {
            title: 'Updated Blog Post',
            content: 'Updated content',
        };
        const response = await request(app).put('/blogs/999').send(updatedBlog);
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Blog not found');
    });
});
