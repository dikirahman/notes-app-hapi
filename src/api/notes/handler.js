const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    // post note
    async postNoteHandler(request, h) {
        try {
            // validate payload
            this._validator.validateNotePayload(request.payload);
            // get data from request payload
            const { title = 'untitled', body, tags } = request.payload;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // add note
            const noteId = await this._service.addNote({ 
                title, body, tags, owner: credentialId, 
            });

            // return a successful response
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            });

            response.code(201);
            return response;

        // if it fails
        } catch (error) {
            // return a error response
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

    // get all notes
    async getNotesHandler(request) {
        // get user id from credential
        const { id: credentialId } = request.auth.credentials;
        // get note
        const notes = await this._service.getNotes(credentialId);

        // return a successful response
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }

    // get note by id
    async getNoteByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // verify note owner
            await this._service.verifyNoteOwner(id, credentialId);
            // get note
            const note = await this._service.getNoteById(id, credentialId);

            // return a successful response
            return {
              status: 'success',
              data: {
                note,
              },
            };

        // if it fails
        } catch (error) {
            // return a error response
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

    // put note by id
    async putNoteByIdHandler(request, h) {
        try {
            // call validator
            this._validator.validateNotePayload(request.payload);
            // get data from request parameter
            const { id } = request.params;
            // get user id from creadential
            const { id: credentialId} = request.auth.credentials;
        
            
            // verify note owner
            await this._service.verifyNoteOwner(id, credentialId);
            // edit note
            await this._service.editNoteById(id, request.payload);
        
            // return a successful response
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };

        // if it fails
        } catch (error) {
            // return a error response
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

    // delete note by id
    async deleteNoteByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // verify owner
            await this._service.verifyNoteOwner(id, credentialId);
            // delete note
            await this._service.deleteNoteById(id);

            // return a successfull response
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            }
        // if it fails
        } catch (error) {
            // return a error response
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

module.exports = NotesHandler;