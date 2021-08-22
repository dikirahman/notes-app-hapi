const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');

const init = async () => {
  // create notesService instance from NotesService
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
        cors: {
          origin: ['*'],
        },
    },
  });

  // register notes plugin with options.service
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
    },
  });

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
