import fs from 'fs';

export function isExists(directoryPath: string, target: string | null = null): boolean {
    try {
        if (fs.existsSync(directoryPath)) {
            const filesAndDirs = fs.readdirSync(directoryPath);

            if (target) return filesAndDirs.includes(target!);

            return !!fs.readdirSync(directoryPath)
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Ocorreu um erro ao verificar a existência da pasta Azure: ${error}`);
        return false;
    }
}