const form = document.getElementById("formulario");

const nome = document.getElementById("campo-nome");
const email = document.getElementById("campo-email");
const tel = document.getElementById("campo-tel");
const data = document.getElementById("campo-data");
const pesquisa = document.getElementById("campo-satisfacao");

const confirmacao = document.getElementById("confirm");

const usuarios = [];

class Usuario {
    constructor (nome, email, tel, nascimento, pesquisa) {
        this.nome = nome;
        this.email = email;
        this.tel = tel;
        this.nascimento = nascimento;
        this.pesquisa = pesquisa;
    }

    exibirInformacoes() {
        console.log("Nome: " + this.nome);
        console.log("Email: " + this.email);
        console.log("Telefone: " + this.tel);
        if (this.nascimento) {console.log("Nascimento: " + this.nascimento)}
        if (this.pesquisa) {console.log("Recomendação: " + this.pesquisa)}
    }
}

nome.addEventListener("focus", () => {
    confirmacao.textContent = "";
})

email.addEventListener("focus", () => {
    confirmacao.textContent = "";
})

tel.addEventListener("focus", () => {
    confirmacao.textContent = "";
})

data.addEventListener("focus", () => {
    confirmacao.textContent = "";
})

pesquisa.addEventListener("focus", () => {
    confirmacao.textContent = "";
})

form.addEventListener("submit", function(event) {
    event.preventDefault();

    usuarios.push(new Usuario(nome.value, email.value, tel.value, data.value, pesquisa.value));
    usuarios.at(-1).exibirInformacoes();

    confirmacao.textContent = "Formulário enviado com sucesso!"
    
    form.reset();
})
