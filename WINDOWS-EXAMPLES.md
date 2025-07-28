# 🪟 Exemplos de Uso - Windows

Este arquivo contém exemplos específicos para o uso da CLI nocsharp no Windows.

## 📋 Comandos Básicos (cmd/PowerShell)

### Verificar Instalação
```cmd
nocsharp --help
nc --version
```

### Criar Projeto
```cmd
nocsharp new MeuProjeto
cd MeuProjeto
```

## 🎯 Exemplos de Scaffold

### Entidades Simples
```cmd
REM Entidade básica
nocsharp scaffold Usuario nome:string email:string idade:int

REM Verificar arquivos gerados
dir Domain\Entities\*Usuario*
type Domain\Entities\UsuarioEntity.cs
```

### Tipos Complexos
```cmd
REM Entidade com coleções
nocsharp scaffold Produto nome:string categorias:List<string> preco:decimal

REM Entidade com dicionário
nocsharp scaffold Configuracao nome:string parametros:Dictionary<string,string>

REM Entidade com HashSet
nocsharp scaffold Tag nome:string posts:HashSet<string>
```

### Relacionamentos Entre Entidades
```cmd
REM Primeiro, criar entidade base
nocsharp scaffold Usuario nome:string email:string

REM Depois, criar entidade que referencia
nocsharp scaffold Empresa nome:string funcionarios:List<Usuario> ceo:Usuario

REM Verificar código gerado
type Domain\Entities\EmpresaEntity.cs
```

## 🏢 Projeto Completo - Sistema de RH

```cmd
REM Criar projeto
nocsharp new SistemaRH
cd SistemaRH

REM Entidades básicas
nocsharp scaffold Funcionario nome:string email:string cpf:string salario:decimal
nocsharp scaffold Departamento nome:string descricao:string

REM Entidades com relacionamentos
nocsharp scaffold Cargo titulo:string salarioBase:decimal departamento:Departamento
nocsharp scaffold Projeto nome:string descricao:string responsavel:Funcionario equipe:List<Funcionario>

REM Entidades complexas
nocsharp scaffold Folha funcionario:Funcionario mes:int ano:int beneficios:Dictionary<string,decimal>
nocsharp scaffold Avaliacao funcionario:Funcionario avaliador:Funcionario notas:Dictionary<string,int>
```

## 🛒 Projeto E-commerce

```cmd
REM Criar projeto
nocsharp new EcommerceWin
cd EcommerceWin

REM Estrutura base
nocsharp scaffold Cliente nome:string email:string telefone:string
nocsharp scaffold Categoria nome:string descricao:string
nocsharp scaffold Produto nome:string preco:decimal categoria:Categoria estoque:int

REM Funcionalidades avançadas
nocsharp scaffold Carrinho cliente:Cliente itens:Dictionary<Produto,int> total:decimal
nocsharp scaffold Pedido cliente:Cliente produtos:List<Produto> status:string data:DateTime
nocsharp scaffold Avaliacao cliente:Cliente produto:Produto nota:int comentario:string
```

## 📚 Projeto Sistema Escolar

```cmd
nocsharp new SistemaEscolar
cd SistemaEscolar

REM Entidades básicas
nocsharp scaffold Aluno nome:string matricula:string email:string
nocsharp scaffold Professor nome:string email:string especialidade:string
nocsharp scaffold Disciplina nome:string cargaHoraria:int professor:Professor

REM Relacionamentos complexos
nocsharp scaffold Turma codigo:string disciplina:Disciplina alunos:List<Aluno> semestre:string
nocsharp scaffold Nota aluno:Aluno disciplina:Disciplina valor:decimal bimestre:int
nocsharp scaffold Frequencia aluno:Aluno disciplina:Disciplina presencas:HashSet<DateTime>
```

## 🎮 Opções Especiais

### Sem BaseEntity
```cmd
REM Entidade independente (não herda de BaseEntity)
nocsharp scaffold ConfigSistema chave:string valor:string --baseSkip
```

### Com ID Management
```cmd
REM Entidade com gerenciamento de ID específico
nocsharp scaffold LogAuditoria acao:string usuario:string --id
```

### PostgreSQL
```cmd
REM Configurar para PostgreSQL com schema específico
nocsharp scaffold UsuarioDb nome:string --postgres usuarios:public
```

## 🔍 Verificação dos Arquivos Gerados

### Listar Arquivos por Tipo
```cmd
REM Entidades
dir /s Domain\Entities\*.cs

REM Commands
dir /s Domain\Commands\*.cs

REM Handlers
dir /s Domain\Handlers\*.cs

REM Repositories
dir /s Infrastructure\Repositories\*.cs

REM Controllers
dir /s API\Controllers\*.cs
```

### Verificar Conteúdo
```cmd
REM Ver entidade gerada
type Domain\Entities\UsuarioEntity.cs

REM Ver command gerado
type Domain\Commands\UsuarioCommands\CreateUsuarioCommand.cs

REM Ver controller gerado
type API\Controllers\UsuarioController.cs
```

## 🚨 Solução de Problemas

### Comando não reconhecido
```cmd
REM Verificar se está no PATH
echo %PATH%

REM Executar diretamente
%USERPROFILE%\.nocsharp-cli\nocsharp.bat --help

REM Ou se instalado via NPM
%APPDATA%\npm\nocsharp.cmd --help
```

### Problemas com caracteres especiais
```cmd
REM Use aspas para argumentos com espaços ou caracteres especiais
nocsharp scaffold "Usuário Sistema" "nome:string" "descrição:string"

REM Para Dictionary, use aspas
nocsharp scaffold Config "params:Dictionary<string,string>"
```

### Verificar estrutura do projeto
```cmd
REM Ver árvore de diretórios
tree /f Domain
tree /f API
tree /f Infrastructure
```

## 💡 Dicas para Windows

1. **Use PowerShell**: Melhor suporte a caracteres Unicode
2. **Aspas duplas**: Para argumentos com espaços
3. **Escape de caracteres**: Use ` (backtick) no PowerShell
4. **Verificação**: Sempre verifique os arquivos gerados
5. **PATH**: Certifique-se que a CLI está no PATH

## 📝 Script de Automação

Exemplo de script batch para criar projeto completo:

```batch
@echo off
echo Criando projeto completo...

nocsharp new MeuSistema
cd MeuSistema

echo Criando entidades base...
nocsharp scaffold Usuario nome:string email:string
nocsharp scaffold Empresa nome:string cnpj:string

echo Criando relacionamentos...
nocsharp scaffold Funcionario nome:string empresa:Empresa usuario:Usuario

echo Projeto criado com sucesso!
pause
```

Salve como `criar-projeto.bat` e execute para automatizar a criação.
