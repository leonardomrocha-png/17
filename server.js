import express from "express";

const app = express();
const PORT = 3000;


// Exercício 1.1
function saudacaoAssincrona(nome) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Olá, ${nome}! Bem-vindo ao Mensageiro Local.`);
    }, 2000);
  });
}

// Exercício 1.2
function obterMensagemPorId(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        return reject(new Error("ID inválido: deve ser maior que zero"));
      }
      resolve({ id: id, texto: "Mensagem do laboratório" });
    }, 1000);
  });
}


// Exercício 2.1
app.get("/saudacao-then", (req, res) => {
  saudacaoAssincrona("Aluno")
    .then((mensagem) => {
      res.send(mensagem);
    })
    .catch((erro) => {
      res.status(500).json({ erro: erro.message });
    });
});


app.get("/mensagem-invalida-then", (req, res) => {
  obterMensagemPorId(-5)
    .then((msg) => {
      res.json(msg);
    })
    .catch((erro) => {
      res.status(500).json({ erro: erro.message });
    });
});



// Exercício 3.1
app.get("/saudacao-async", async (req, res) => {
  try {
    const mensagem = await saudacaoAssincrona("Aluno do Futuro");
    res.send(mensagem);
  } catch (erro) {
    res.status(500).json({ erro: "Falha na saudação" });
  }
});

// Exercício 3.2
app.get("/mensagem-erro-async", async (req, res) => {
  try {
    const msg = await obterMensagemPorId(-10);
    res.json(msg);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

function buscarMensagemNoBanco(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isNaN(id) || id <= 0) {
        return reject(new Error("ID_INVALIDO"));
      }
      if (id === 999) {
        return reject(new Error("ERRO_CONEXAO"));
      }
      resolve({
        id,
        autor: "Lab 04",
        conteudo: "Mensagem recuperada com sucesso!"
      });
    }, 1500);
  });
}

app.get("/mensagens/:id", async (req, res) => {
  try {
    const idNumerico = Number(req.params.id);
    const mensagem = await buscarMensagemNoBanco(idNumerico);
    res.status(200).json(mensagem);
  } catch (erro) {
    if (erro.message === "ID_INVALIDO") {
      return res.status(400).json({ erro: "O ID informado deve ser um número positivo." });
    }
    res.status(500).json({ erro: "Erro interno ao consultar o banco de dados." });
  }
});


app.get("/", (req, res) => {
  res.send("Servidor Express online e operando normalmente!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});