import accepted from './confirm';

export interface ConfirmOptions {
    message: string;
    autoConfirm?: boolean;
    defaultValue?: boolean;
}

export async function askConfirmation(options: ConfirmOptions): Promise<boolean> {
    const { message, autoConfirm = false, defaultValue = false } = options;
    
    // Se autoConfirm for true (--yes ou --force), retorna true automaticamente
    if (autoConfirm) {
        return true;
    }
    
    // Caso contrário, pergunta ao usuário
    return await accepted(message);
}

export function getAutoConfirmFromOptions(options: any): boolean {
    return options.yes || options.y || options.force || options.f || false;
}
