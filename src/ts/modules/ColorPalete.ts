export let colors = [] as any;

export class ColorPalete {
    private particlesCount: number;
    private color1 = [];
    private color2 = [];

    constructor(particlesCount: number, color1: string, color2: string) {
        this.particlesCount = particlesCount;

        this.color1 = this.toRGB(color1);
        this.color2 = this.toRGB(color2);

        this.setPalete();
    }

    private toRGB(val: string): number[] {
        const hex = (val.length >6) ? val.substr(1, val.length - 1) : val;
        let r, 
            g, 
            b;

        if (hex.length > 3) {
            r = hex.substr(0, 2);
            g = hex.substr(2, 2);
            b = hex.substr(4, 2);
        } else {
            r = hex.substr(0, 1) + hex.substr(0, 1);
            g = hex.substr(1, 1) + hex.substr(1, 1);
            b = hex.substr(2, 1) + hex.substr(2, 1);
        
        }
        // return our clean values
        return [
            parseInt(r, 16),
            parseInt(g, 16),
            parseInt(b, 16)
        ]
    }

    private setPalete() : void {

        const stepsPerc = 100 / (this.particlesCount + 1);

        const valClampRGB = [
            this.color2[0] - this.color1[0],
            this.color2[1] - this.color1[1],
            this.color2[2] - this.color1[2]
        ];
        
        for (let i = 0; i < this.particlesCount; i++) {
            const clampedR = (valClampRGB[0] > 0) 
            ? this.pad((Math.round(valClampRGB[0] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) 
            : this.pad((Math.round((this.color1[0] + (valClampRGB[0]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);
            
            const clampedG = (valClampRGB[1] > 0) 
            ? this.pad((Math.round(valClampRGB[1] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) 
            : this.pad((Math.round((this.color1[1] + (valClampRGB[1]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);
            
            const clampedB = (valClampRGB[2] > 0) 
            ? this.pad((Math.round(valClampRGB[2] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) 
            : this.pad((Math.round((this.color1[2] + (valClampRGB[2]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

            colors[i] = [
                '#',
                clampedR,
                clampedG,
                clampedB
            ].join('') as any;
        }
    }

    private pad(n?, width?, z?): number {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}