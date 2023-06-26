import { GameScene } from "../scenes/gamescene";
import { InputManager } from "./inputmanager";
import { GameObject, ScrollingBackground } from "./object";
import { Scene } from "./scene";

export class Canvas {
    assets: {[index: string]: HTMLImageElement}
    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D
    globalObjects: Array<GameObject | ScrollingBackground>
    scenes: {[index: string]: Scene}
    activeScene: string

    constructor(dimensions: number[], assets: {[index: string]: HTMLImageElement}) {
        this.assets = assets;
        this.element = document.createElement('canvas') as HTMLCanvasElement;

        this.element.width = dimensions[0]
        this.element.height = dimensions[1]
        this.element.id = 'game-canvas';
        this.ctx = this.element.getContext('2d')!;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.font = '15px arial'
        document.getElementById('screen')!.appendChild(this.element);
        this.element.appendChild
        
        this.load()

        this.scenes = {}
        this.activeScene = 'game'
        this.globalObjects = []
    }

    reset() {
        localStorage.clear()
    }

    save() {
        // save localstorage things
    }

    load() {
        // load localstorage things
    }

    initScenes() {
        this.scenes['game'] = new GameScene(this, this.assets)
    }

    render() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  
        this.ctx.fillStyle = '#a0a0a0';
        this.ctx.fillRect(0, 0, this.element.width, this.element.height);
          
        for (let item of this.globalObjects) {
            item.render(this.ctx);
        }

        switch(this.activeScene) {
            case('title'):
                break;
            case('game'):
                this.scenes['game'].render(this);
                break;
        }
    }

    update(inputManager: InputManager, deltaTime: number) {
        switch(this.activeScene) {
            case('title'):
                break;
            case('game'):
                this.scenes['game'].updateInput(inputManager);
                this.scenes['game'].update(deltaTime)
                break;
        }
        
    }
}