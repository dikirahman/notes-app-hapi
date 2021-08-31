const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    // add new user
    async addUser({ username, password, fullname }) {
        // run verify username
        await this.verifyNewUsername(username);
        
        // id with prefix user
        const id = `user-${nanoid(16)}`;
        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);
        // insert users
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };
        // run query
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;

    }

    // verify username
    async verifyNewUsername(username) {
        // select username from database
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };
       
        // run query
        const result = await this._pool.query(query);

        // if username  already in database
        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    // get user by id
    async getUserById(userId) {
        // select user from database
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };
    
        // run query
        const result = await this._pool.query(query);
 
        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = UsersService;
