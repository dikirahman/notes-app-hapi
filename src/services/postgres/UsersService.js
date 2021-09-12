const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

 
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

    // check credential, valid or invalid
    async verifyUserCredential(username, password) {
        // check password and username from database
        const query = {
          text: 'SELECT id, password FROM users WHERE username = $1',
          values: [username],
        };

        // run query
        const result = await this._pool.query(query);
        // if id and password not found
        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        // if id and password found
        const { id, password: hashedPassword } = result.rows[0];

        // compare hashedpassword value with password
        const match = await bcrypt.compare(password, hashedPassword);

        // if hashedpassword is different with password
        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        // if the hashedpassword is the same as the password
        return id;
    }

    // get user by username
    async getUsersByUsername(username) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
            values: [`%${username}%`],
        };
        
        const result = await this._pool.query(query);
        return result.rows;
      
    }
}

module.exports = UsersService;
