import confirm from '@inquirer/confirm';

async function accepted(message: string) {
    return await confirm({ message: message })
}

export default accepted;