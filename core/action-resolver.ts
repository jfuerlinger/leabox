export interface ActionResolver {
    getUrlForAction(action: string): string;
}