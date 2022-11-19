const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});


test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de respostas', () => {
  const perguntas = modelo.listar_perguntas()
  
  perguntas.forEach(pergunta => {
    modelo.cadastrar_resposta(pergunta.id_pergunta, 'Gostei da pergunta ' + pergunta.id_pergunta)
  });

  perguntas.forEach(pergunta => {
    modelo.get_respostas.forEach(resposta => {
      expect(resposta).toBe('Gostei da pergunta ' + pergunta.id_pergunta)
    })
  })
});

test('Testando get de uma única pergunta pelo id', () => {
  modelo.cadastrar_pergunta('Ovo engorda?');
  const perguntaID = modelo.listar_perguntas()[0].id_pergunta
  
  const IDEsperado = perguntaID
  const esperado = {
    id_pergunta: IDEsperado,
    texto: 'Ovo engorda?',
    id_usuario: 1
  }
  expect(modelo.get_pergunta(perguntaID)).toEqual(esperado)

});

test('Respostas de uma pergunta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');

  const IDPergunta = modelo.listar_perguntas()[0].id_pergunta

  modelo.cadastrar_resposta(IDPergunta, "Resposta numero 1")
  modelo.cadastrar_resposta(IDPergunta, "Resposta numero 2")
  modelo.cadastrar_resposta(IDPergunta, "Resposta numero 3")

  const resp = (idR, numP) => new Object({id_resposta: idR, id_pergunta: IDPergunta, texto: 'Resposta numero ' + numP})

  const resps = modelo.get_respostas(IDPergunta)

  resps.forEach((resposta, i) => {
    expect(resposta).toEqual(resp(resposta.id_resposta, i + 1))
  })
})


