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
            // call validator
            this._validator.validateNotePayload(request.payload);
            // get data from request payload
            const { title = 'untitled', body, tags } = request.payload;

            // call method
            const noteId = await this._service.addNote({ title, body, tags });

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
    async getNotesHandler() {
        // call method
        const notes = await this._service.getNotes();

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

            // call method
            const note = await this._service.getNoteById(id);

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
        
            // call method
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

            // call method
            await this._service.deleteNoteById(id);

            // return a successfull response
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            }
        // if it fails
        } catch (error) {
            // return a error response
            const response = h.response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            });
            
            response.code(404);
            return response;
        }
    }
}

module.exports = NotesHandler;