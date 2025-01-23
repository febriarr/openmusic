const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapAlbumsToModel = require('../../utils/albums');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async postAlbum({ name, year }) {
        // Generate Id
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO albums (id, name, year, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, name, year, createdAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool('SELECT * FROM albums');
        return result.rows.map(mapAlbumsToModel);
    }

    async getAlbumById(id) {
        const albumQuery = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const albumResult = await this._pool.query(albumQuery);

        if (!albumResult.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const album = albumResult.rows[0];

        const songsQuery = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        };

        const songResult = await this._pool.query(songsQuery);

        return {
            ...album,
            songs: songResult.rows,
        };
    }

    async putAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal memperbarui album. Id tidak ditenukan'
            );
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus album');
        }
    }
}

module.exports = AlbumsService;
