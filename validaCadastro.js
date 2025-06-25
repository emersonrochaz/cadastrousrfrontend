const API_URL = 'http://127.0.0.1:5001/usuarios';

let usuarios = [];
let indexEdicao = -1;
let indexSelecionado = -1;
let usuarioEdicao = null;  

function mostrarMensagem(texto, tipo) {
    const divMsg = document.getElementById('mensagem');
    divMsg.textContent = texto;
    divMsg.className = 'mensagem';
    divMsg.classList.add(tipo);
    divMsg.classList.add('show');

    setTimeout(() => {
        divMsg.classList.remove('show');
        setTimeout(() => {
            divMsg.textContent = '';
            divMsg.className = 'mensagem';
        }, 500);
    }, 5000);
}

function validarFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const departamento = document.getElementById('departamento').value;
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;

    if (nome === '') {
        mostrarMensagem('O campo Nome Completo é obrigatório.', 'aviso');
        return false;
    }

    if (departamento === '') {
        mostrarMensagem('Selecione um Departamento.', 'aviso');
        return false;
    }

    const usuarioRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!usuarioRegex.test(usuario)) {
        mostrarMensagem('O campo Usuário deve estar no formato nome.sobrenome', 'erro');
        return false;
    }

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
    if (!senhaRegex.test(senha)) {
        mostrarMensagem('A senha deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.', 'erro');
        return false;
    }

    return true;
}

async function buscarUsuariosAPI() {
  try {
    const res = await fetch(`${API_URL}/listarusuarios`);
    if (!res.ok) throw new Error('Erro ao buscar usuários');
    usuarios = await res.json();
    renderizarLista();
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

async function buscarUsuarioPorSerial(serial) {
  // Busca um usuário pelo serial (usuario)
  try {
    const res = await fetch(`${API_URL}/${serial}/buscarusuario`);
    if (res.status === 404) {
      mostrarMensagem('Usuário não encontrado.', 'aviso');
      return null;
    }
    if (!res.ok) throw new Error('Erro ao buscar usuário');
    const user = await res.json();
    return user;
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
    return null;
  }
}

async function cadastrarUsuarioAPI(usuario) {
  try {
    const res = await fetch(`${API_URL}/cadastrodeusuario`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(usuario),
    });
    if (res.status === 201) {
      mostrarMensagem('Usuário cadastrado com sucesso!', 'sucesso');
      buscarUsuariosAPI();
      limparCampos();
    } else {
      const data = await res.json();
      mostrarMensagem(data.message || 'Erro ao cadastrar usuário', 'erro');
    }
  } catch {
    mostrarMensagem('Erro na comunicação com o servidor', 'erro');
  }
}

async function atualizarUsuarioAPI(usuario, usuarioObj) {
  try {
    const res = await fetch(`${API_URL}/${usuario}/atualizarusuario`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(usuarioObj),
    });
    if (res.ok) {
      mostrarMensagem('Usuário atualizado com sucesso!', 'aviso');
      buscarUsuariosAPI();
      limparCampos();
    } else {
      const data = await res.json();
      mostrarMensagem(data.message || 'Erro ao atualizar usuário', 'erro');
    }
  } catch {
    mostrarMensagem('Erro na comunicação com o servidor', 'erro');
  }
}

async function deletarUsuarioAPI(usuario) {
  try {
    const res = await fetch(`${API_URL}/${usuario}/deletarusuario`, { method: 'DELETE' });
    if (res.ok) {
      mostrarMensagem('Usuário deletado com sucesso!', 'aviso');
      buscarUsuariosAPI();
      indexSelecionado = -1;
      limparCampos();
    } else {
      mostrarMensagem('Erro ao deletar usuário', 'erro');
    }
  } catch {
    mostrarMensagem('Erro na comunicação com o servidor', 'erro');
  }
}

function renderizarLista() {
    const lista = document.getElementById('listaUsuarios');
    lista.innerHTML = '';

    usuarios.forEach((user, index) => {
        const item = document.createElement('li');
        item.textContent = `Nome: ${user.nome} | Departamento: ${user.departamento} | Usuário: ${user.usuario}`;
        item.style.cursor = 'pointer';

        if (index === indexSelecionado) {
            item.style.backgroundColor = '#d0eaff';
        } else {
            item.style.backgroundColor = '';
        }

        item.onclick = () => {
            indexSelecionado = index;
            renderizarLista();
        };

        lista.appendChild(item);
    });
}

function carregarParaEdicao() {
    if (indexSelecionado === -1) {
        mostrarMensagem('Selecione um usuário antes de clicar em Atualizar.', 'aviso');
        return;
    }

    const user = usuarios[indexSelecionado];
    document.getElementById('nome').value = user.nome;
    document.getElementById('departamento').value = user.departamento;
    document.getElementById('usuario').value = user.usuario;
    document.getElementById('senha').value = user.senha || '';

    indexEdicao = indexSelecionado;
    usuarioEdicao = user.usuario;

    mostrarMensagem('Usuário carregado para edição.', 'aviso');
}

function processarFormulario() {
    if (!validarFormulario()) return;

    const usuarioObj = {
        nome: document.getElementById('nome').value.trim(),
        departamento: document.getElementById('departamento').value,
        usuario: document.getElementById('usuario').value.trim(),
        senha: document.getElementById('senha').value
    };

    if (indexEdicao === -1) {
        cadastrarUsuarioAPI(usuarioObj);
    } else {
        atualizarUsuarioAPI(usuarioEdicao, usuarioObj);
    }
}

function deletarUsuarioSelecionado() {
    if (indexSelecionado === -1) {
        mostrarMensagem('Selecione um usuário antes de deletar.', 'aviso');
        return;
    }
    const user = usuarios[indexSelecionado];

    const confirmacao = document.getElementById('confirmacao');
    const texto = document.getElementById('textoConfirmacao');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');

    texto.textContent = `Tem certeza que deseja deletar o usuário: ${user.nome} (${user.usuario})?`;
    confirmacao.classList.add('show');

    btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
    btnCancelar.replaceWith(btnCancelar.cloneNode(true));

    const novoBtnConfirmar = document.getElementById('btnConfirmar');
    const novoBtnCancelar = document.getElementById('btnCancelar');

    novoBtnConfirmar.onclick = () => {
        deletarUsuarioAPI(user.usuario);
        confirmacao.classList.remove('show');
    };

    novoBtnCancelar.onclick = () => {
        confirmacao.classList.remove('show');
    };
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('departamento').value = '';
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';

    indexEdicao = -1;
    usuarioEdicao = null;
    indexSelecionado = -1;

    renderizarLista();
}



async function buscarUsuarioNaLista() {
    const serial = document.getElementById('inputBuscaUsuario').value.trim();
    if (serial === '') {
        mostrarMensagem('Informe um usuário para buscar.', 'aviso');
        return;
    }

    const user = await buscarUsuarioPorSerial(serial);
    if (user) {
        usuarios = [user];
        indexSelecionado = -1;
        indexEdicao = -1;
        usuarioEdicao = null;
        renderizarLista();
    }
}

function limparBuscaUsuario() {
    document.getElementById('inputBuscaUsuario').value = '';
    buscarUsuariosAPI();
    indexSelecionado = -1;
    indexEdicao = -1;
    usuarioEdicao = null;
}

document.getElementById('btnAtualizar').addEventListener('click', carregarParaEdicao);
document.getElementById('btnDeletar').addEventListener('click', deletarUsuarioSelecionado);
document.getElementById('btnBuscarUsuario').addEventListener('click', buscarUsuarioNaLista);
document.getElementById('btnLimparBusca').addEventListener('click', limparBuscaUsuario);

document.getElementById('senha').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        processarFormulario();
    }
});

window.onload = () => {
    buscarUsuariosAPI();
};
