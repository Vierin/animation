// import { ColorPalete, colors } from "./modules/ColorPalete";

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
    private itemRadius: number;
    private startPositionX: number;
    private speed: number;
    private reallSpeed: number;
    private dotSize: number;
    private colors: string[];

    constructor() {
        this.view = document.querySelector('.js-animation');

        // settings
        this.itemsCount = 2;
        this.itemRadius = 200;
        this.speed = 0.001;
        
        
        this.circleRadius = 150;
        this.circlesCount = 20; // 20
        this.circleStep = 360 / this.circlesCount;
        

        this.particlesCount = 20; //20

        this.dotSize = 5;

        this.startPositionX = window.innerWidth * 0.5;
        
        // const palete = new ColorPalete(this.circlesCount, "#FFEF40", "#8E8955");
        this.colors = ["FFEF40","FFEF40","FFEF40","FFEF40","FFEF40","FFEF40","FFEF40","FFEF40","FFEF40","E0D240","C0B541","A19941","424242","424242","424242","424242","424242","424242","424242","424242"];
        
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
         // easing
        this.reallSpeed = this.speed % 360 + (1 + Math.sin((90 + this.speed) / 180 * Math.PI)) * 50;     
        
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

    private drawItem(itemsId?: number): void {
        // draw circles = single item
        for (let j = 0; j < this.circlesCount; j++) {
            const reallSpeed = this.speed % 360 + (1 + Math.sin((90 + this.speed + j * 3) / 180 * Math.PI)) * 50;
            const startPos = 180 * itemsId + 30;
            
            let angle = startPos + j * this.circleStep + reallSpeed;
            // console.log();
           
            
            let x = this.startPositionX + (this.itemRadius * (2 * (itemsId - 1)))
            
            const y = window.innerHeight * 0.5;

            const obj = {
                x:  x + this.itemRadius * Math.cos(angle * Math.PI / 180),
                y:  y + this.itemRadius * Math.sin(angle * Math.PI / 180)
            }

            this.drawCirle(obj, j);
        }
    }

    private drawCirle(centerForCircle: {x: number, y: number}, circleId: number): void {
        // draw 1 circle
        for (let i = 0; i < this.particlesCount; i++) {
            let angle = (i * this.circleStep);
          
            const x = this.itemsCount > 1 
            ? 
            (centerForCircle.x - (this.itemRadius * this.itemsCount)) + Math.cos(angle * Math.PI / 180) 
            : 
            centerForCircle.x + Math.cos(angle * Math.PI / 180);
             
            const centerForParticles = { 
                x,
                y: centerForCircle.y + Math.cos(angle * Math.PI / 180)
            };

            this.drawParticle(centerForParticles, angle, circleId);
        } 
    }


    private drawParticle(centerForParticles: {x: number; y: number}, angle: number, circleId: number): void {
        // draw each particle
        const x = centerForParticles.x + this.circleRadius * Math.cos(angle * Math.PI / 180);
        const y = centerForParticles.y + this.circleRadius * Math.sin(angle * Math.PI / 180);
        
        this.drawOneParticle(x, y, circleId);
    }

    private drawOneParticle(x: number, y: number, circleId: number): void {
        
        const size = this.dotSize - (this.dotSize / this.circlesCount) * circleId;
        const dotsCount = 5;
        const particleRadius = dotsCount * 3;
        const radius = particleRadius - (particleRadius / this.circlesCount) * circleId;
        const reallSpeed = this.speed % 360 + (1 + Math.sin((90 + this.speed + circleId) / 180 * Math.PI)) * 50;

         
        
        this.ctx.beginPath();
        const dotStep = 360 / dotsCount;
        // colors  
        this.ctx.fillStyle = `#${this.colors[circleId]}`;
        
        // draw dot 
        for (let i = 0; i < dotsCount; i++) {
           
            const xCenter = x + radius * Math.cos((i * dotStep + reallSpeed) * Math.PI / 180);
            const yCenter = y + radius * Math.sin((i * dotStep + reallSpeed) * Math.PI / 180);

            this.ctx.moveTo(x, y);
            this.ctx.arc(
                xCenter,
                yCenter,
                size, 
                0, Math.PI * 2);
        }

        //  end draw dot

        this.ctx.fill();
    }
}

const app = new Main();