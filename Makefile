# Makefile para nocsharp CLI

.PHONY: build install uninstall clean test help

# Variáveis
NPM = npm
NODE = node
CLI_NAME = nocsharp
DIST_DIR = dist
BUILD_DIR = build

help: ## Mostra esta ajuda
	@echo "📦 nocsharp CLI - Makefile"
	@echo "========================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Compila o projeto TypeScript
	@echo "🔨 Compilando projeto..."
	$(NPM) run build
	@chmod +x $(DIST_DIR)/index.js
	@echo "✅ Compilação concluída!"

install: build ## Instala a CLI globalmente
	@echo "📦 Instalando CLI globalmente..."
	$(NPM) install -g .
	@echo "✅ $(CLI_NAME) instalado!"
	@echo "💡 Use: $(CLI_NAME) --help"

install-dev: build ## Instala em modo desenvolvimento (link)
	@echo "🔗 Instalando em modo desenvolvimento..."
	$(NPM) link
	@echo "✅ Link criado!"

uninstall: ## Remove a CLI do sistema
	@echo "🗑️  Removendo CLI..."
	$(NPM) uninstall -g $(CLI_NAME) || true
	$(NPM) unlink || true
	@echo "✅ CLI removida!"

test: build ## Testa a CLI
	@echo "🧪 Testando CLI..."
	$(NODE) $(DIST_DIR)/index.js --help
	$(NODE) $(DIST_DIR)/index.js --version
	@echo "✅ Testes básicos passaram!"

clean: ## Limpa arquivos compilados
	@echo "🧹 Limpando arquivos..."
	rm -rf $(DIST_DIR)
	rm -rf node_modules
	@echo "✅ Limpeza concluída!"

publish: build test ## Publica no NPM
	@echo "📤 Publicando no NPM..."
	$(NPM) publish
	@echo "✅ Publicado!"

package: build ## Cria pacote para distribuição
	@echo "📦 Criando pacote..."
	mkdir -p $(BUILD_DIR)
	cp -r $(DIST_DIR) template package.json README.md LICENSE* $(BUILD_DIR)/ 2>/dev/null || true
	cd $(BUILD_DIR) && tar -czf ../$(CLI_NAME)-$(shell grep '"version"' package.json | cut -d'"' -f4).tar.gz .
	@echo "✅ Pacote criado!"

# Atalhos
i: install ## Atalho para install
b: build   ## Atalho para build
t: test    ## Atalho para test
c: clean   ## Atalho para clean

# Instalação rápida
quick-install: ## Instalação rápida (build + install)
	@$(MAKE) build
	@$(MAKE) install

# Reinstalação completa
reinstall: ## Reinstalação completa
	@$(MAKE) uninstall
	@$(MAKE) clean
	@$(NPM) install
	@$(MAKE) install
