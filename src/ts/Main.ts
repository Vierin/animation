import { ColorPalete, colors } from "./modules/ColorPalete";

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
    private speed: number;
    private dotSize: number;

    constructor() {
        this.view = document.querySelector('.js-animation');

        // settings
        this.itemsCount = 2;
        this.itemRadius = 200;
        this.speed = 0.001;
        
        
        this.circleRadius = 150;
        this.circlesCount = 20;
        this.circleStep = 360 / this.circlesCount;
        

        this.particlesCount = 20;
        this.particleSize = 10;
        this.particleStep = 360 / this.particlesCount;

        this.dotSize = 5;

        this.startPositionX = window.innerWidth * 0.5;
        
        const palete = new ColorPalete(this.particlesCount, "#FFEF40", "#424242");
        
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
        this.speed++

        this.ctx.clearRect(0, 0, this.canvas.width * this.pixelRatio, this.canvas.height * this.pixelRatio);

        for (let i = 1; i <= this.itemsCount; i++) {
            this.drawItem(i);
        }
        
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

        this.start();
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
            let angle = ((this.speed) + i * this.circleStep);
            // let angle = (i * this.circleStep);
            // easing
            angle -= Math.sin((90 + angle) / 180 * Math.PI) * 100 * this.circleStep / 150;
          
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
        
        this.drawOneParticle(x, y, i)
    }

    private drawOneParticle(x: number, y: number, id: number): void {
        
        const size = this.dotSize - (this.dotSize / this.particlesCount) * id;
        
        const offsetX = size * 2;
        const offsetY1 = offsetX * .82;
        const offsetX2 = offsetX * .64;
        
        this.ctx.beginPath();
        // 1 
        this.ctx.arc(
            x,
            y,
            size, 
            0, Math.PI * 2);
        // 2
        this.ctx.moveTo(x + offsetX, y + 8);
        this.ctx.arc(
            x + offsetX, 
            y + offsetY1, 
            size, 
            0, Math.PI * 2); 
        // 3
        this.ctx.moveTo(x - offsetX, y + 8);
        this.ctx.arc(
            x - offsetX, 
            y + offsetY1, 
            size, 
            0, Math.PI * 2); 
        // 4 
        this.ctx.moveTo(x - offsetX2, y + offsetX * 2.1);
        this.ctx.arc(
            x - offsetX2, 
            y + offsetX * 2.1, 
            size, 
            0, Math.PI * 2);  
        // 5
        this.ctx.moveTo(x + offsetX2, y + offsetX * 2.1);
        this.ctx.arc(
            x + offsetX2, 
            y + offsetX * 2.1, 
            size, 
            0, Math.PI * 2); 

        this.ctx.fill();
    }
}

const app = new Main();