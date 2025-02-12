export default class ColorManager {

    private readonly colors: Record<string, string>;


    // Remember to update also variables.scss
    constructor() {
        this.colors = {
            color1: '#F53132',
            color2: '#943D3D',
            color3: '#FA0202',
            color4: '#803B3B',
            color5: '#332929',
            white: '#cccccc',
            black: '#222222',
            blackRed: '#443333',
        };
    }

    getColor(key: string): string {
        return this.colors[key];
    }
}