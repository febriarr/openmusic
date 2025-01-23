const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgre/AlbumsService');
const albums = require('./api/albums');
const AlbumValidator = require('./validator/albums');
const ClientError = require('./exceptions/ClientError');
const SongsService = require('./services/postgre/SongsService');
const songs = require('./api/songs');
const SongValidator = require('./validator/songs');
require('dotenv').config();

const init = async () => {
    const albumsService = new AlbumsService();

    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();
