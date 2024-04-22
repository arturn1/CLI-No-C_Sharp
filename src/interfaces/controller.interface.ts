interface Command {
    commandName: string;
    isUpdateCommand: boolean;
}

export default interface Generation {
    title: string;
    name: string;
    content: string[];
    command?: Command[];
}
