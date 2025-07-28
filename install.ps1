# Script de instalação da CLI nocsharp para Windows (PowerShell)
# Execute com: PowerShell -ExecutionPolicy Bypass -File install.ps1

param(
    [Parameter(HelpMessage="Método de instalação: 'global', 'link', ou 'manual'")]
    [ValidateSet('global', 'link', 'manual')]
    [string]$Method
)

Write-Host "🚀 Instalando nocsharp CLI para Windows..." -ForegroundColor Green

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale Node.js primeiro:" -ForegroundColor Red
    Write-Host "   • Baixe em: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   • Escolha a versão LTS recomendada" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado. Instale o npm primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Solicitar método de instalação se não fornecido
if (-not $Method) {
    Write-Host ""
    Write-Host "Escolha o método de instalação:"
    Write-Host "1) NPM Global (recomendado)"
    Write-Host "2) Link local (desenvolvimento)"
    Write-Host "3) Manual (cópia direta)"
    Write-Host ""
    
    do {
        $choice = Read-Host "Digite sua escolha (1-3)"
    } while ($choice -notin @('1', '2', '3'))
    
    switch ($choice) {
        '1' { $Method = 'global' }
        '2' { $Method = 'link' }
        '3' { $Method = 'manual' }
    }
}

switch ($Method) {
    'global' {
        Write-Host "📦 Instalando via NPM global..." -ForegroundColor Blue
        try {
            npm install -g .
            Write-Host "✅ Instalação concluída!" -ForegroundColor Green
            Write-Host "💡 Use: nocsharp ou nc" -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Erro na instalação. Tente executar como Administrador." -ForegroundColor Red
            Write-Host "   PowerShell como Admin: Start-Process PowerShell -Verb RunAs" -ForegroundColor Yellow
            exit 1
        }
    }
    
    'link' {
        Write-Host "🔗 Criando link local..." -ForegroundColor Blue
        try {
            npm link
            Write-Host "✅ Link criado!" -ForegroundColor Green
            Write-Host "💡 Use: nocsharp ou nc" -ForegroundColor Cyan
        } catch {
            Write-Host "❌ Erro ao criar link. Tente executar como Administrador." -ForegroundColor Red
            exit 1
        }
    }
    
    'manual' {
        Write-Host "📁 Instalação manual..." -ForegroundColor Blue
        
        # Criar diretório
        $installDir = "$env:USERPROFILE\.nocsharp-cli"
        if (-not (Test-Path $installDir)) {
            New-Item -ItemType Directory -Path $installDir -Force | Out-Null
        }
        
        # Compilar
        Write-Host "🔨 Compilando projeto..." -ForegroundColor Yellow
        try {
            npm run build
        } catch {
            Write-Host "❌ Erro na compilação." -ForegroundColor Red
            exit 1
        }
        
        # Copiar arquivos
        Write-Host "📁 Copiando arquivos..." -ForegroundColor Yellow
        Copy-Item -Path "dist" -Destination "$installDir\dist" -Recurse -Force
        Copy-Item -Path "template" -Destination "$installDir\template" -Recurse -Force
        Copy-Item -Path "package.json" -Destination $installDir -Force
        
        # Criar executável nocsharp.bat
        Write-Host "📝 Criando executáveis..." -ForegroundColor Yellow
        $batContent = @"
@echo off
cd /d "$installDir"
node dist\index.js %*
"@
        Set-Content -Path "$installDir\nocsharp.bat" -Value $batContent
        Copy-Item -Path "$installDir\nocsharp.bat" -Destination "$installDir\nc.bat"
        
        # Adicionar ao PATH do usuário
        Write-Host "🛠️ Configurando PATH..." -ForegroundColor Yellow
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($currentPath -notlike "*$installDir*") {
            $newPath = "$currentPath;$installDir"
            [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
            Write-Host "✅ PATH atualizado. Abra um novo terminal para usar os comandos." -ForegroundColor Green
        }
        
        Write-Host "✅ Instalação manual concluída!" -ForegroundColor Green
        Write-Host "⚠️  Abra um novo terminal (cmd/PowerShell) para usar os comandos" -ForegroundColor Yellow
        Write-Host "💡 Use: nocsharp ou nc" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🎉 Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Teste a instalação (em um novo terminal):" -ForegroundColor Cyan
Write-Host "   nocsharp --help"
Write-Host "   nc --help"
Write-Host ""
Write-Host "🚀 Criar primeiro projeto:" -ForegroundColor Cyan
Write-Host "   nocsharp new MeuProjeto"
Write-Host "   cd MeuProjeto"
Write-Host "   nocsharp scaffold Usuario nome:string email:string"
Write-Host ""
Write-Host "📝 Dica: Se os comandos não funcionarem, reinicie o terminal ou:" -ForegroundColor Yellow
Write-Host "   • Windows: Feche e abra novamente o cmd/PowerShell"
Write-Host "   • VS Code: Feche e abra novamente o terminal integrado"
Write-Host ""

if ($Method -eq 'manual') {
    Write-Host "🔄 Para aplicar as mudanças do PATH imediatamente, execute:" -ForegroundColor Yellow
    Write-Host '   $env:PATH += ";' + $installDir + '"' -ForegroundColor Gray
}

Read-Host "Pressione Enter para finalizar"
