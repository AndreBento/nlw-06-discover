const Database = require('../db/config');

module.exports = {
  async create(request, response) {
    const db = await Database();
    const pass = request.body.password;
    let roomId = '';
    let isRoom = true;

    while (isRoom) {

      // Gera o numero da sala
      for (var i = 0; i < 6; i++) {
        roomId += Math.floor(Math.random() * 10).toString();
      };

      // Verifica se esse numero ja existi
      const roomsExistsIds = await db.all(`SELECT id FROM rooms`);
      isRoom = roomsExistsIds.some(roomExistId => roomExistId === parseInt(roomId));
      
      if (!isRoom) {
        // inseri a sala no banco
        await db.run(`INSERT INTO rooms (
        id,
        pass
      ) VALUES (
        ${parseInt(roomId)},
        ${pass}
      )`);
      };
    };

    await db.close();

    response.redirect(`/room/${roomId}`);
  },

  async open(request, response){
    const db = await Database();
    const roomId = request.params.room;
    const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} ORDER BY read ASC`);
    // const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 1`);
    let isNoQuestions;

    if(questions.length == 0) {
      // if(questionsRead.length == 0) {
        isNoQuestions = true;
      // }
    }
    
    response.render('room', {roomId: roomId, questions: questions, isNoQuestions: isNoQuestions});
    // response.render('room', {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions});
  },

  enter(request, response){
    const roomId = request.body.roomId;
    response.redirect(`/room/${roomId}`);
  }
}