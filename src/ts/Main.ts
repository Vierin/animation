class Main {
    private view: HTMLElement;
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private viewport = {
        width: 0,
        height: 0,
    };
    private pixelRatio = Math.min(2, Math.floor(window.devicePixelRatio || 1));
    private raf: number;
    private isAnimating = false;

    // settings vars
    private itemsCount: number;
    private circleRadius: number;
    private circlesCount: number;
    private circleStep: number;
    private particlesCount: number;
    private particleSize: number;
    private particleStep: number;
    private itemRadius: number;
    private startPositionX: number;

    constructor() {
        this.view = document.querySelector('.js-animation');

        // settings
        this.itemsCount = 1;
        this.itemRadius = 200;
        
        
        this.circleRadius = 150;
        this.circlesCount = 20;
        this.circleStep = 360 / this.circlesCount;
        

        this.particlesCount = 20;
        this.particleSize = 10;
        this.particleStep = 360 / this.particlesCount;

        this.startPositionX = window.innerWidth * 0.5;
        
        this.initCanvas();
    }

    public stop(): void {
        if (this.isAnimating) {
            this.isAnimating = false;
            window.cancelAnimationFrame(this.raf);
        }
    }


    public start(): void {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.loop();
        }
    }

    public draw(): void {
        // this.ctx.clearRect(0, 0, this.canvas.width * this.pixelRatio, this.canvas.height * this.pixelRatio);

    }

    public resize = (wdt?: number, hgt?: number): void => {
        if (!this.canvas) {
            return;
        }
        this.viewport.width = wdt;
        this.viewport.height = hgt;
        this.canvas.width = this.viewport.width * this.pixelRatio;
        this.canvas.height = this.viewport.height * this.pixelRatio;
        this.canvas.style.width = `${this.viewport.width}px`;
        this.canvas.style.height = `${this.viewport.height}px`;
    };

    private loop = (): void => {
        this.draw();
        this.raf = window.requestAnimationFrame(this.loop);
    };

    private initCanvas(): void {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.canvas = this.view.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.viewport.width * this.pixelRatio;
        this.canvas.height = this.viewport.height * this.pixelRatio;
        this.canvas.style.width = `${this.viewport.width}px`;
        this.canvas.style.height = `${this.viewport.height}px`;

        // this.start();

        this.drawAllItems(this.itemsCount);
        
    }

    private drawAllItems (count: number) {
        for (let i = 1; i <= count; i++) {
            this.drawItem(i);
        }
    }



    private drawItem(count?: number): void {

        // draw circles = single item
        for (let j = 0; j < this.circlesCount; j++) {
            let angle = 125 + j * this.circleStep;
            
            let x = this.startPositionX + (this.itemRadius * (2 * (count - 1)))
            
            const y = window.innerHeight * 0.5;

            const obj = {
                x:  x + this.itemRadius * Math.cos(angle * Math.PI / 180),
                y:  y + this.itemRadius * Math.sin(angle * Math.PI / 180)
            }

            this.drawCirle(obj);
        }
    }

    private drawCirle(centerForCircle: {x: number, y: number}): void {
        // draw 1 circle
        for (let i = 0; i < this.particlesCount; i++) {
            let angle = (125 + i * this.circleStep);
          
            const x = this.itemsCount > 1 
            ? 
            (centerForCircle.x - (this.itemRadius * this.itemsCount)) + Math.cos(angle * Math.PI / 180) 
            : 
            centerForCircle.x + Math.cos(angle * Math.PI / 180);
             
            const centerForParticles = { 
                x,
                y: centerForCircle.y + Math.cos(angle * Math.PI / 180)
            };

            this.drawParticle(centerForParticles, i, angle);
        } 
    }

    private drawParticle(centerForParticles: {x: number; y: number}, i: number, angle: number): void {
        // draw each particle
        const x = centerForParticles.x + this.circleRadius * Math.cos(angle * Math.PI / 180);
        const y = centerForParticles.y + this.circleRadius * Math.sin(angle * Math.PI / 180);

        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.particleSize, 0, Math.PI * 2);
        // change position for many items
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

const app = new Main();