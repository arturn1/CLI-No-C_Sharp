# 🪟 Guia de Instalação - Windows

## Pré-requisitos

1. **Node.js** (versão 14 ou superior)
   - Baixe em: https://nodejs.org/
   - Escolha a versão LTS (recomendada)
   - Durante a instalação, marque a opção "Add to PATH"

2. **npm** (incluído com Node.js)

## Métodos de Instalação

### 🚀 Método 1: Script Automático (Recomendado)

#### Opção A: PowerShell (Recomendado)
```powershell
# Execute no PowerShell como Administrador
PowerShell -ExecutionPolicy Bypass -File install.ps1
```

#### Opção B: Batch
```cmd
# Execute no cmd como Administrador
install.bat
```

### 📦 Método 2: NPM Global

```cmd
# No terminal (cmd/PowerShell) como Administrador
npm install -g .
```

### 🔗 Método 3: Link Local (Desenvolvimento)

```cmd
# No diretório do projeto
npm link
```

### 📁 Método 4: Instalação Manual

1. Compile o projeto:
```cmd
npm run build
```

2. Crie um diretório para a CLI:
```cmd
mkdir %USERPROFILE%\.nocsharp-cli
```

3. Copie os arquivos necessários:
```cmd
xcopy /E /I dist %USERPROFILE%\.nocsharp-cli\dist
xcopy /E /I template %USERPROFILE%\.nocsharp-cli\template
copy package.json %USERPROFILE%\.nocsharp-cli\
```

4. Crie o executável `nocsharp.bat`:
```batch
@echo off
cd /d "%USERPROFILE%\.nocsharp-cli"
node dist\index.js %*
```

5. Adicione ao PATH:
   - Windows 10/11: Configurações > Sistema > Sobre > Configurações avançadas do sistema > Variáveis de ambiente
   - Adicione: `%USERPROFILE%\.nocsharp-cli`

## Verificação da Instalação

```cmd
# Teste os comandos
nocsharp --help
nc --help
nocsharp --version
```

## Primeiro Uso

```cmd
# Criar um projeto
nocsharp new MeuProjeto
cd MeuProjeto

# Gerar uma entidade
nocsharp scaffold Usuario nome:string email:string idade:int

# Com tipos complexos
nocsharp scaffold Empresa nome:string funcionarios:List<Usuario> ceo:Usuario
```

## Solução de Problemas

### ❌ "nocsharp não é reconhecido como comando"

**Solução 1: Reiniciar terminal**
- Feche e abra novamente o cmd/PowerShell
- No VS Code: `Ctrl+Shift+P` > "Terminal: Kill All Terminals" > Abrir novo terminal

**Solução 2: Verificar PATH**
```cmd
echo %PATH%
```
Deve conter o diretório da CLI.

**Solução 3: Executar diretamente**
```cmd
# NPM Global
%APPDATA%\npm\nocsharp --help

# Manual
%USERPROFILE%\.nocsharp-cli\nocsharp.bat --help
```

### ❌ "Erro de permissão" durante instalação

**Solução: Executar como Administrador**
```cmd
# PowerShell como Admin
Start-Process PowerShell -Verb RunAs

# Ou usar cmd como Administrador
```

### ❌ "npm não encontrado"

**Solução: Reinstalar Node.js**
1. Desinstale Node.js existente
2. Baixe novamente de https://nodejs.org/
3. Durante instalação, marque "Add to PATH"
4. Reinicie o computador

### ❌ Problemas com ExecutionPolicy (PowerShell)

```powershell
# Verificar política atual
Get-ExecutionPolicy

# Alterar temporariamente
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Ou executar diretamente
PowerShell -ExecutionPolicy Bypass -File install.ps1
```

## Comandos Disponíveis

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `nocsharp new <nome>` | Criar projeto | `nocsharp new MeuProjeto` |
| `nocsharp scaffold <entidade> [campos...]` | Gerar scaffold | `nocsharp scaffold User nome:string` |
| `nocsharp --help` | Ajuda | `nocsharp --help` |
| `nc` | Alias para nocsharp | `nc scaffold Post titulo:string` |

## Tipos Suportados

### Tipos Básicos
- `string`, `int`, `long`, `decimal`, `bool`, `DateTime`, `Guid`

### Tipos Complexos
- `List<tipo>` - Lista de elementos
- `Dictionary<chave,valor>` - Dicionário
- `HashSet<tipo>` - Conjunto único

### Tipos de Entidades
- `Usuario`, `Produto`, etc. - Referências a outras entidades
- `List<Usuario>` - Lista de entidades
- `Dictionary<Usuario,string>` - Dicionário com entidades

## Exemplos Avançados

```cmd
# Entidade com tipos complexos
nocsharp scaffold Produto nome:string preco:decimal categorias:List<string>

# Relacionamentos entre entidades
nocsharp scaffold Empresa nome:string funcionarios:List<Usuario> ceo:Usuario

# Com opções
nocsharp scaffold Post titulo:string --baseSkip
nocsharp scaffold User nome:string --id
```

## Desinstalação

### NPM Global
```cmd
npm uninstall -g nocsharp
```

### Manual
```cmd
rmdir /s %USERPROFILE%\.nocsharp-cli
# Remover do PATH manualmente
```

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os pré-requisitos
2. Tente reinstalar Node.js
3. Execute como Administrador
4. Use a instalação manual como alternativa

**Comandos de diagnóstico:**
```cmd
node --version
npm --version
where nocsharp
echo %PATH%
```
