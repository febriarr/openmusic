class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;
        const albumId = await this._service.postAlbum({
            name,
            year,
        });

        const response = h.response({
            status: 'success',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;

        await this._service.putAlbumById(id, request.payload);

        return h
            .response({
                status: 'success',
                message: 'Berhasil mengedit album',
            })
            .code(200);
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);

        return h.response({
            status: 'success',
            message: 'Berhasil menghapus Album',
        });
    }
}

module.exports = AlbumsHandler;
