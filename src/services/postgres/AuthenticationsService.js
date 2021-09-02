const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
 
class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    // add token
    async addRefreshToken(token) {
        // insert token to database
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        };
        
        // run query
        await this._pool.query(query);
    }

    // verify refresh token from database
    async verifyRefreshToken(token) {
        // check token from database
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };
    
        // run query
        const result = await this._pool.query(query);

        // if refresh token not found
        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    // delete refresh token
    async deleteRefreshToken(token) {
        await this.verifyRefreshToken(token);
     
        const query = {
          text: 'DELETE FROM authentications WHERE token = $1',
          values: [token],
        };
        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;
