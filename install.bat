@echo off
:: Script de instalação da CLI nocsharp para Windows
:: Este script instala a CLI globalmente no sistema Windows

echo 🚀 Instalando nocsharp CLI para Windows...

:: Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js primeiro:
    echo    • Baixe em: https://nodejs.org/
    echo    • Escolha a versão LTS recomendada
    pause
    exit /b 1
)

:: Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Instale o npm primeiro.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION% encontrado
echo ✅ npm %NPM_VERSION% encontrado

echo.
echo Escolha o método de instalação:
echo 1) NPM Global (recomendado)
echo 2) Link local (desenvolvimento)
echo 3) Manual (cópia direta)
echo.

set /p choice=Digite sua escolha (1-3): 

if "%choice%"=="1" goto npm_global
if "%choice%"=="2" goto npm_link
if "%choice%"=="3" goto manual_install
echo ❌ Opção inválida
pause
exit /b 1

:npm_global
echo 📦 Instalando via NPM global...
call npm install -g .
if %errorlevel% neq 0 (
    echo ❌ Erro na instalação. Tente executar como Administrador.
    pause
    exit /b 1
)
echo ✅ Instalação concluída!
echo 💡 Use: nocsharp ou nc
goto end

:npm_link
echo 🔗 Criando link local...
call npm link
if %errorlevel% neq 0 (
    echo ❌ Erro ao criar link. Tente executar como Administrador.
    pause
    exit /b 1
)
echo ✅ Link criado!
echo 💡 Use: nocsharp ou nc
goto end

:manual_install
echo 📁 Instalação manual...

:: Criar diretório
set INSTALL_DIR=%USERPROFILE%\.nocsharp-cli
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Compilar
echo 🔨 Compilando projeto...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro na compilação.
    pause
    exit /b 1
)

:: Copiar arquivos
echo 📁 Copiando arquivos...
xcopy /E /I /Y dist "%INSTALL_DIR%\dist"
xcopy /E /I /Y template "%INSTALL_DIR%\template"
copy /Y package.json "%INSTALL_DIR%\"
copy /Y node_modules "%INSTALL_DIR%\node_modules" 2>nul

:: Criar executável nocsharp.bat
echo 📝 Criando executável...
echo @echo off > "%INSTALL_DIR%\nocsharp.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\nocsharp.bat"
echo node dist\index.js %%* >> "%INSTALL_DIR%\nocsharp.bat"

:: Criar alias nc.bat
copy "%INSTALL_DIR%\nocsharp.bat" "%INSTALL_DIR%\nc.bat"

:: Adicionar ao PATH do usuário
echo 🛠️ Configurando PATH...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo ✅ Instalação manual concluída!
echo ⚠️  Abra um novo terminal (cmd/PowerShell) para usar os comandos
echo 💡 Use: nocsharp ou nc

:end
echo.
echo 🎉 Instalação concluída!
echo.
echo 📖 Teste a instalação (em um novo terminal):
echo    nocsharp --help
echo    nc --help
echo.
echo 🚀 Criar primeiro projeto:
echo    nocsharp new MeuProjeto
echo    cd MeuProjeto
echo    nocsharp scaffold Usuario nome:string email:string
echo.
echo 📝 Dica: Se os comandos não funcionarem, reinicie o terminal ou:
echo    • Windows: Feche e abra novamente o cmd/PowerShell
echo    • VS Code: Feche e abra novamente o terminal integrado
echo.
pause
