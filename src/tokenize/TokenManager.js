const Jwt = require('@hapi/jwt');

const TokenManager = {

    // generate access token
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    // generate refresh token
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
    // verify refresh token
    verifyRefreshToken: (refreshToken) => {
        try {
          const artifacts = Jwt.token.decode(refreshToken);
          Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
          const { payload } = artifacts.decoded;
          return payload;
        } catch (error) {
          throw new InvariantError('Refresh token tidak valid');
        }
      },
};
 
module.exports = TokenManager;
