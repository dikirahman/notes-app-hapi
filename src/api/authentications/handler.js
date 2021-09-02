const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    // post authentication handler
    async postAuthenticationHandler(request, h) {
        try {
            // verification request payload, have username and password string or not
            this._validator.validatePostAuthenticationPayload(request.payload);

            // get username and password
            const { username, password } = request.payload;
            
            // check credential 
            const id = await this._usersService.verifyUserCredential(username, password);

            // generate acces token and refresh token
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            // add refresh token to database
            await this._authenticationsService.addRefreshToken(refreshToken);

            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                  accessToken,
                  refreshToken,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });

          response.code(500);
          console.error(error);
          return response;
        }
    }

    // put authentication handler
    async putAuthenticationHandler(request, h) {
        try {
            // check refresh token from request payload
            this._validator.validatePutAuthenticationPayload(request.payload);

            // get refresh token
            const { refreshToken } = request.payload;

            // verification refresh token from database and signature token 
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            // create new access token
            const accessToken = this._tokenManager.generateAccessToken({ id });

            return {
                status: 'success',
                message: 'Access Token berhasil diperbarui',
                data: {
                accessToken,
                },
            };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });

          response.code(500);
          console.error(error);
          return response;
        }
    }

    // delete authentication handler
    async deleteAuthenticationHandler(request, h) {
        try {
            // check refresh token from request payload
            this._validator.validateDeleteAuthenticationPayload(request.payload);

            // get refresh token
            const { refreshToken } = request.payload;

            // check refresh token from database there is or not
            await this._authenticationsService.verifyRefreshToken(refreshToken);

            // delete refresh token from database
            await this._authenticationsService.deleteRefreshToken(refreshToken);

            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
    }
}

module.exports = AuthenticationsHandler;
