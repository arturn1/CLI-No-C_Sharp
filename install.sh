#!/bin/bash

# Script de instalação da CLI nocsharp para Linux/macOS
# Este script instala a CLI globalmente no sistema

set -e

echo "🚀 Instalando nocsharp CLI..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro:"
    echo "   • Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "   • CentOS/RHEL: sudo yum install nodejs npm"
    echo "   • macOS: brew install node"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"

# Determinar método de instalação
echo ""
echo "Escolha o método de instalação:"
echo "1) NPM Global (recomendado)"
echo "2) Link local (desenvolvimento)"
echo "3) Manual (cópia direta)"

read -p "Digite sua escolha (1-3): " choice

case $choice in
    1)
        echo "📦 Instalando via NPM global..."
        npm install -g .
        echo "✅ Instalação concluída!"
        echo "💡 Use: nocsharp ou nc"
        ;;
    2)
        echo "🔗 Criando link local..."
        npm link
        echo "✅ Link criado!"
        echo "💡 Use: nocsharp ou nc"
        ;;
    3)
        echo "📁 Instalação manual..."
        
        # Criar diretório
        INSTALL_DIR="$HOME/.local/bin"
        mkdir -p "$INSTALL_DIR"
        
        # Compilar
        npm run build
        
        # Copiar arquivos
        cp -r dist template "$INSTALL_DIR/nocsharp-cli"
        cp package.json "$INSTALL_DIR/nocsharp-cli/"
        
        # Criar executável
        cat > "$INSTALL_DIR/nocsharp" << EOF
#!/bin/bash
cd "$INSTALL_DIR/nocsharp-cli"
node dist/index.js "\$@"
EOF
        
        chmod +x "$INSTALL_DIR/nocsharp"
        ln -sf "$INSTALL_DIR/nocsharp" "$INSTALL_DIR/nc"
        
        # Adicionar ao PATH se necessário
        if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
            echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> ~/.bashrc
            echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> ~/.zshrc 2>/dev/null || true
            echo "⚠️  Adicione $INSTALL_DIR ao seu PATH ou execute:"
            echo "   export PATH=\"\$PATH:$INSTALL_DIR\""
        fi
        
        echo "✅ Instalação manual concluída!"
        echo "💡 Use: nocsharp ou nc"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📖 Teste a instalação:"
echo "   nocsharp --help"
echo "   nc --version"
echo ""
echo "🚀 Criar primeiro projeto:"
echo "   nocsharp new MeuProjeto"
echo "   nocsharp scaffold Usuario nome:string email:string"
