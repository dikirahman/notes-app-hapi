class NotesHandler {
    constructor(service) {
        this._service = service;
        
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    // post note
    postNoteHandler(request, h) {
        try {
            // get data from request payload
            const { title = 'untitled', body, tags } = request.payload;

            // call method
            const noteId = this._service.addNote({ title, body, tags });

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
            const response = hs.response({
                status: 'fail',
                message: error.message,
            });

            response.code(400);
            return response;
        }
    }

    // get all notes
    getNotesHandler() {
        // call method
        const notes = this._service.getNotes();

        // return a successful response
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }

    // get note by id
    getNoteByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;

            // call method
            const note = this._service.getNoteById(id);

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
            const response = h.response({
              status: 'fail',
              message: error.message,
            });

            response.code(404);
            return response;
        }
    }

    // put note by id
    putNoteByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;
        
            // call method
            this._service.editNoteById(id, request.payload);
        
            // return a successful response
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };

        // if it fails
        } catch (error) {
            // return a error response
            const response = h.response({
                status: 'fail',
                message: error.message,
            });

            response.code(404);
            return response;
        }
    }

    deleteNoteByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;

            // call method
            this._service.deleteNoteById(id);

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