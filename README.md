# [CLI] No C#

## Descrição
Este projeto é uma CLI (Command Line Interface) desenvolvida em TypeScript para criar e estruturar projetos C# seguindo uma arquitetura em camadas comum em aplicativos C#. A estrutura do projeto C# inclui camadas para API, Domínio e Infraestrutura, organizando claramente as responsabilidades para facilitar a manutenção e escalabilidade do código.

## 🚀 Funcionalidades

✅ **Criação de Projetos**: Scaffolding completo com arquitetura Clean Architecture  
✅ **Geração de Entidades**: Com suporte a tipos complexos (`List<T>`, `Dictionary<K,V>`, `HashSet<T>`)  
✅ **Relacionamentos**: Entidades podem referenciar outras entidades  
✅ **Commands & Handlers**: Padrão CQRS implementado  
✅ **Repositories**: Interfaces e implementações automáticas  
✅ **Controllers**: APIs REST com injeção de dependência  
✅ **Multiplataforma**: Linux, macOS e Windows  

## Dependências Principais
- **commander**: Biblioteca para criar interfaces de linha de comando
- **mustache**: Para carregar e interpolar os arquivos template

## 📋 Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **npm** (incluído com Node.js)

## 🛠️ Instalação

### 🐧 Linux / 🍎 macOS
```bash
# Clone o repositório
git clone <seu-repositorio>
cd CLI-No-C_Sharp

# Execute o script de instalação
chmod +x install.sh
./install.sh
```

### 🪟 Windows

**Método 1: Script Automático (Recomendado)**
```powershell
# PowerShell como Administrador
PowerShell -ExecutionPolicy Bypass -File install.ps1
```

**Método 2: Batch**
```cmd
# cmd como Administrador
install.bat
```

**📖 Para instruções detalhadas do Windows:** [WINDOWS-INSTALL.md](WINDOWS-INSTALL.md)

## 🚀 Primeiros Passos

### Verificar Instalação
```bash
# Linux/macOS/Windows
nocsharp --help
nc --version
```

### Criar Primeiro Projeto
```bash
# Criar projeto
nocsharp new MeuProjeto
cd MeuProjeto

# Gerar entidade simples
nocsharp scaffold Usuario nome:string email:string idade:int

# Gerar entidade com tipos complexos
nocsharp scaffold Produto nome:string categorias:List<string> preco:decimal

# Gerar com relacionamentos entre entidades
nocsharp scaffold Empresa nome:string funcionarios:List<Usuario> ceo:Usuario
```

### Opções Avançadas
```bash
# Sem herdar de BaseEntity
nocsharp scaffold Post titulo:string --baseSkip

# Com ID management
nocsharp scaffold Task nome:string --id

# PostgreSQL com schema
nocsharp scaffold User nome:string --postgres users:public
```

## 📖 Comandos Disponíveis

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `new <nome>` | Criar novo projeto | `nocsharp new MeuApp` |
| `scaffold <entidade> [campos...]` | Gerar entidade completa | `nocsharp scaffold User nome:string` |
| `--help` | Mostrar ajuda | `nocsharp --help` |
| `--version` | Versão da CLI | `nocsharp --version` |

### Aliases
- `nocsharp` = `nc` (comando mais curto)

## 🎯 Tipos Suportados

### Tipos Primitivos
- `string`, `int`, `long`, `decimal`, `bool`, `DateTime`, `Guid`, `char`, `byte`, `short`, `float`, `double`

### Tipos Complexos
- `List<tipo>` - Lista de elementos
- `ICollection<tipo>` - Coleção de elementos  
- `HashSet<tipo>` - Conjunto único de elementos
- `Dictionary<chave,valor>` - Dicionário chave-valor

### Entidades Customizadas
- `Usuario`, `Produto`, `Empresa` - Referências a outras entidades
- `List<Usuario>` - Lista de entidades
- `Dictionary<Usuario,string>` - Dicionário com entidades como chave

## 💡 Exemplos Práticos

### Exemplo 1: E-commerce
```bash
# Criar projeto
nocsharp new EcommerceApp
cd EcommerceApp

# Entidades básicas
nocsharp scaffold Usuario nome:string email:string
nocsharp scaffold Categoria nome:string descricao:string
nocsharp scaffold Produto nome:string preco:decimal categoria:Categoria

# Relacionamentos complexos
nocsharp scaffold Pedido cliente:Usuario produtos:List<Produto> total:decimal data:DateTime
nocsharp scaffold Carrinho usuario:Usuario itens:Dictionary<Produto,int>
```

### Exemplo 2: Sistema de Blog
```bash
nocsharp new BlogSystem
cd BlogSystem

nocsharp scaffold Autor nome:string email:string
nocsharp scaffold Post titulo:string conteudo:string autor:Autor tags:HashSet<string>
nocsharp scaffold Comentario texto:string post:Post autor:Autor
```

### Exemplo 3: Gestão de Projetos
```bash
nocsharp new ProjectManager
cd ProjectManager

nocsharp scaffold Usuario nome:string email:string
nocsharp scaffold Projeto nome:string descricao:string membros:List<Usuario> gerente:Usuario
nocsharp scaffold Tarefa titulo:string projeto:Projeto responsavel:Usuario prazo:DateTime
```

## Estrutura do Projeto C#
O projeto gerado segue a seguinte estrutura:

API:

- Configurations: Classes de configuração relacionadas à API.
- Controllers: Controladores responsáveis por receber solicitações HTTP.
- Properties: Arquivos relacionados às propriedades do projeto.

Application:

- DTOs: Objetos de Transferência de Dados que representam as estruturas de dados utilizadas nas interações entre a camada de aplicação e a API.
- Interfaces: Definições de interfaces para serviços que serão implementados na camada de serviços.
- Services: Implementações de serviços que realizam as operações de negócios e interagem com a camada de domínio.

Core:

- Commands: Definição de comandos que representam ações na aplicação.
- Entities: Modelos de dados (entidades) representando objetos de domínio.
- Handlers: Classes de manipulação que processam comandos ou eventos.
- Repositories: Interfaces e implementações de repositórios para interação com o armazenamento de dados.
- Validation: Classes de validação que garantem integridade dos dados e aplicam regras de negócios.


Infraestrutura:

- Configuration: Classes de configuração relacionadas a serviços de infraestrutura.
- Data: Implementação do acesso ao banco de dados, mapeamento de entidades e operações de persistência.


Ioc:

- Program.cs: Ponto de entrada da aplicação.
- appSettings.cs: Classes representando configurações da aplicação em formato de código.
- appSettings.Development.json: Configurações específicas do ambiente de desenvolvimento.

## Uso
A CLI oferece os seguintes comandos:

- nc help:

Exibe informações de ajuda sobre o uso da CLI.
<br />

- `nc g` ou `nc g help`:

Exibe informações de ajuda sobre os comandos de geração.
<br />

- `nc new <nome do projeto>`

Cria um novo projeto C# estruturado seguindo a arquitetura em camadas.
<br />

- `nc g entity` ou `nc g e`:

```nc g entity <nameEntity> [fields...]```

Este comando gera uma entidade com o nome especificado e os campos fornecidos. Os campos devem ser fornecidos no formato name:type.

#### Opções
--postgres <postgreSQLFields>: Especifica campos adicionais para serem usados em bases de dados PostgreSQL. Os campos devem ser fornecidos no formato table:schema.

#### Exemplos de Uso

```
# Criar uma entidade chamada "User" com os campos "name:string" e "age:int"
nc g e User name:string age:int
```

```
# Criar uma entidade chamada "Product" com os campos "name:string" e "price:decimal" e campos PostgreSQL adicionais
nc g e Product name:string price:decimal --postgres products:public
```
<br />

- `nc g command` ou `nc g f`:

```nc g command <nameCommand> [fields...] --type <typeFields> --id```

Este comando tem o objetivo de gerar um comando com o nome especificado e campos opcionais. Os campos devem ser fornecidos no formato name:type. O comando também suporta opções adicionais:

Opções
--type <typeFields>: Especifica o tipo de gerenciamento que o comando terá.

--id: Indica se o comando terá um identificador.

#### Exemplos de Uso

```
# Criar um comando chamado "Generate" com campos opcionais e tipo de gerenciamento
nc g command Generate [fields...] --type <typeFields> --id
```

```
# Atalho para criar um comando usando a opção "f"
nc g f Generate [fields...] --type <typeFields> --id
```
<br />

- `nc g repository` ou `nc g r`

```
nc g repository <nameRepository> [fields...]
```

Este comando tem o objetivo de gerar um repositório com o nome especificado e campos opcionais. Os campos devem ser fornecidos no formato name:type. O comando também suporta opções adicionais:

#### Exemplos de Uso

```
# Criar um repositório chamado "ProductRepository" com campos opcionais
nc g repository ProductRepository [fields...]
```

```
# Atalho para criar um repositório usando a opção "f"
nc g r ProductRepository [fields...]
```
<br />

- `nc g handler` ou `nc g h`

```
nc g handler <nameHandler> [fields...] --repository
```

Este comando tem o objetivo de gerar um manipulador com o nome especificado e campos opcionais. Os campos devem ser fornecidos no formato name:type. O comando também suporta opções adicionais:

Opções
--repository: Este comando cria um manipulador no repositório de destino.

#### Exemplos de Uso

```
# Criar um manipulador chamado "ProductHandler" com campos opcionais no repositório
nc g handler ProductHandler [fields...] --repository
```

```
# Atalho para criar um manipulador usando a opção "f"
nc g h ProductHandler [fields...] --repository
```
<br />

- `nc g controler` ou `nc g c`:

```
nc g controller <nameController> [fields...]
```

Este comando tem o objetivo de gerar um controlador com o nome especificado e campos opcionais. Os campos devem ser fornecidos no formato name:type.

Exemplos de Uso

```
# Criar um controlador chamado "ProductController" com campos opcionais
nc g controller ProductController [fields...]
```

```
# Atalho para criar um controlador usando a opção "f"
nc g c ProductController [fields...]
```
<br />

- `nc s` ou `nc scaffold`

```
nc s <nameScaffold> [fields...] --postgres <postgreSQLFields> --baseSkip --id
```

Este comando cria automaticamente uma entidade, comandos, manipuladores, repositórios e controladores em um projeto. Ele suporta opções para especificar campos adicionais para bases de dados PostgreSQL, ignorar a entidade base, e incluir um identificador.

Opções
--postgres <postgreSQLFields>: Especifica campos adicionais para serem usados em bases de dados PostgreSQL. Os campos devem ser fornecidos no formato table:schema.

--baseSkip: Este comando ignora a entidade base.

--id: Gera o arquivo com a opção de identificador.

#### Exemplo de Uso

```
# Criar automaticamente uma estrutura completa para um recurso chamado "Product"
nc s Product name:string price:decimal --postgres products:public --id
```

### Notas
Este comando está atualmente em manutenção, e novos recursos e opções serão adicionados em versões futuras. Fique atento para atualizações.

## Estrutura do Projeto C#
O projeto gerado seguirá a seguinte estrutura:

- API:

  Configurations: Classes de configuração relacionadas à API.
  Controllers: Controladores responsáveis por receber solicitações HTTP.
  Properties: Arquivos relacionados às propriedades do projeto.

- Core:

  Commands: Definição de comandos que representam ações na aplicação.
  Entities: Modelos de dados (entidades) representando objetos de domínio.
  Handlers: Classes de manipulação que processam comandos ou eventos.
  Repositories: Interfaces e implementações de repositórios para interação com o armazenamento de dados.
  Validation: Classes de validação que garantem integridade dos dados e aplicam regras de negócios.

- Infraestrutura:

  Configuration: Classes de configuração relacionadas a serviços de infraestrutura.
  Data: Implementação do acesso ao banco de dados, mapeamento de entidades e operações de persistência.

- Ioc:

  Program.cs: Ponto de entrada da aplicação.
  appSettings.cs: Classes representando configurações da aplicação em formato de código.
  appSettings.Development.json: Configurações específicas do ambiente de desenvolvimento.

## Scripts
npm run build: Compila o código TypeScript para JavaScript.
npm start: Inicia a CLI.