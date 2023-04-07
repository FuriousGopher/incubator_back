import request from 'supertest'

import {app} from '../../src'

describe('getAllBlogs endpoint', () => {

    it('should return a 404 for non-existent blogs', async () => {
        const response = await request(app).get('/blogs?category=nonexistent');
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Blogs not found');
    });
});

describe('getBlogById endpoint', () => {


    it('should return a 404 for non-existent blog id', async () => {
        const response = await request(app).get('/blogs/999');
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Blog not found');
    });
});

describe('createNewBlog endpoint', () => {
    it('should create a new blog', async () => {
        const newBlog = {
            title: 'New Blog Post',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        };
        const response = await request(app).post('/blogs').send(newBlog);
        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            id: 3,
            ...newBlog,
        });
    });

    it('should return a 400 for invalid blog data', async () => {
        const invalidBlog = { title: 'Invalid Blog Post' };
        const response = await request(app).post('/blogs').send(invalidBlog);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errorsMessages: ['Missing content field'],
        });
    });
});

describe('deleteBlogById endpoint', () => {
    it('should delete a blog by id', async () => {
        const response = await request(app).delete('/blogs/1');
        expect(response.status).toEqual(204);
    });

    it('should return a 404 for non-existent blog id', async () => {
        const response = await request(app).delete('/blogs/999');
        expect(response.status).toEqual(404);
    });
});

describe('updateBlogById endpoint', () => {
    it('should update a blog by id', async () => {
        const updatedBlog = {
            title: 'Updated Blog Post',
            content: 'Updated content',
        };
        const response = await request(app).put('/blogs/2').send(updatedBlog);
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
