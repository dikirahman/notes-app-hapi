const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
 
class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    // add collaboration
    async addCollaboration(noteId, userId) {
        // create id collaboration with prefix collab-
        const id = `collab-${nanoid(16)}`;

        // insert colaboration
        const query = {
        text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
        values: [id, noteId, userId],
        };

        // run query
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    // delete colaboration
    async deleteCollaboration(noteId, userId) {
        // delete collaboration
        const query = {
            text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
            values: [noteId, userId],
        };

        // run query
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal dihapus');
        }
    }

    // verified collaborator
    async verifyCollaborator(noteId, userId) {
        // get collaborator by note id and user id
        const query = {
          text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
          values: [noteId, userId],
        };

        // run query
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal diverifikasi');
        }
    }
}

module.exports = CollaborationsService;
