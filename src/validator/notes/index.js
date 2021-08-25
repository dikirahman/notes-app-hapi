const InvariantError = require('../../exceptions/InvariantError');
const { NotePayloadSchema } = require('./schema');

// validation function
const NotesValidator = {
    // validation and evaluate whether the validation was successful or not
    validateNotePayload: (payload) => {
        const validationResult = NotePayloadSchema.validate(payload);

        // if validation error, not undefined
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = NotesValidator;