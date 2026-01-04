export class RandomValues {
    public randomInt(max: number): number {
        return Math.floor(1 + Math.random() * max)
    }

    // https://stackoverflow.com/a/1349426
    public randomString(length: number): string {
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