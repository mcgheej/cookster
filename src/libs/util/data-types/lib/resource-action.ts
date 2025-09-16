export class ResourceAction {
  constructor(
    public name: string = '',
    public timeOffset: number = 0
  ) {}
}

export function resourceActionsEqual(a: ResourceAction, b: ResourceAction): boolean {
  return a.name === b.name && a.timeOffset === b.timeOffset;
}
