export abstract class RandomValues {
    public static randomInt(max: number = 10): number {
        return Math.floor(1 + Math.random() * max)
    }

    public static randomBool() : boolean {
        return this.randomInt(10) % 2 === 0
    }

    // https://stackoverflow.com/a/1349426
    public static randomString(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        const stringLength = this.randomInt(50)
        for (var i = 0; i < stringLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
