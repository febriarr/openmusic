class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, performer, genre, duration, albumId } =
            request.payload;

        const songId = await this._service.postSong({
            title,
            year,
            performer,
            genre,
            duration,
            albumId,
        });

        const response = h.response({
            status: 'success',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    async getSongsHandler(request) {
        const { title = '', performer = '' } = request.query;
        const songs = await this._service.getSongs(title, performer);

        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;

        const song = await this._service.getSongById(id);

        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;

        await this._service.putSongById(id, request.payload);
        return h
            .response({
                status: 'success',
                message: 'Berhasil edit lagu',
            })
            .code(200);
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;
        console.log('id', id);
        await this._service.deleteSongById(id);
        return h
            .response({
                status: 'success',
                message: 'Lagu berhasil dihapus',
            })
            .code(200);
    }
}

module.exports = SongsHandler;
