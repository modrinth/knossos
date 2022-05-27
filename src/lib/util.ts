export abstract class Serializable {
    abstract serialize(pretty?: boolean): string;
    abstract deserialize(data: string): void;
}
