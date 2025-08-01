import { Command } from 'commander';
import { CleanService } from '../services/clean-service';
import { askConfirmation, getAutoConfirmFromOptions } from '../utils/auto-confirm';

export function setupCleanCommand(program: Command) {
    program
        .command('clean [entityName]')
        .alias('remove')
        .description('Remove arquivos gerados pelo scaffold')
        .option('--all', 'Remove todos os arquivos gerados do projeto')
        .option('-f, --force', 'Força a remoção sem confirmação')
        .option('-y, --yes', 'Confirma automaticamente todas as perguntas')
        .option('--list', 'Lista arquivos que seriam removidos sem remover')
        .action(async (entityName, options) => {
            const { all, force, yes, list } = options;
            
            // Se --yes ou --force, não pedir confirmação
            const autoConfirm = getAutoConfirmFromOptions(options);

            try {
                if (list) {
                    // Apenas listar arquivos
                    const files = CleanService.listGeneratedFiles(entityName);
                    
                    if (files.length === 0) {
                        return;
                    }

                    files.forEach(file => {
                        // Lista arquivos sem output
                    });
                    
                    return;
                }

                if (all) {
                    // Limpeza completa
                    const confirm = await askConfirmation({
                        message: '⚠️  Deseja remover TODOS os arquivos gerados? Esta ação não pode ser desfeita: ',
                        autoConfirm
                    });
                    
                    if (!confirm) {
                        return;
                    }
                    
                    const result = CleanService.cleanAll(true);
                    
                    if (!result.success) {
                        result.errors.forEach(error => error);
                        process.exit(1);
                    }
                } else if (entityName) {
                    // Limpeza de entidade específica
                    const confirm = await askConfirmation({
                        message: `⚠️  Deseja remover todos os arquivos da entidade '${entityName}'? Esta ação não pode ser desfeita: `,
                        autoConfirm
                    });
                    
                    if (!confirm) {
                        return;
                    }
                    
                    const result = CleanService.cleanEntity(entityName, true);
                    
                    if (!result.success) {
                        result.errors.forEach(error => error);
                        process.exit(1);
                    }
                } else {
                    // Nenhuma opção específica fornecida
                    process.exit(1);
                }
            } catch (error) {
                process.exit(1);
            }
        });
}
