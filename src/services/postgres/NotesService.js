const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');


class NotesService {
    constructor() {
        this._pool = new Pool();
    }

    // add new note
    async addNote({ title, body, tags }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        // query insert data
        const query = {
            text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, title, body, tags, createdAt, updatedAt],
        };

        // run query
        const result = await this._pool.query(query);

        // if fail add notes
        if (!result.rows[0].id) {
            // return fail
            throw new InvariantError('Catatan gagal ditambahkan');
        }
       
        // return data
        return result.rows[0].id;
    }

    // get all notes
    async getNotes() {
        // run query get data
        const result = await this._pool.query('SELECT * FROM notes');
        // return data and mapping
        return result.rows.map(mapDBToModel);
    }

    // get note by id
    async getNoteById(id) {
        // query get data by id
        const query = {
            text: 'SELECT * FROM notes WHERE id = $1',
            values: [id],
        };
        // run query
        const result = await this._pool.query(query);

        // if note not found
        if (!result.rows.length) {
            // return fail
            throw new NotFoundError('Catatan tidak ditemukan');
        }
        
        // return data and mapping
        return result.rows.map(mapDBToModel)[0];
    }

    // edit note by id
    async editNoteById(id, { title, body, tags }) {
        const updatedAt = new Date().toISOString();

        // query update data
        const query = {
            text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [title, body, tags, updatedAt, id],
        };
    
        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            // return fail
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
        }
    }

    // delete note by id
    async deleteNoteById(id) {
        // query delete data
        const query = {
            text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
            values: [id],
        };
       
        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = NotesService;