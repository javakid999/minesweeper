import { Canvas } from "../api/canvas";
import { InputManager } from "../api/inputmanager";
import { GameObject, GameObjectAnimated, ScrollingBackground } from "../api/object";
import { Scene } from "../api/scene";
import { MinesweeperBoard } from "../game/board";
import { NumberDisplay } from "../game/number";

export class GameScene extends Scene {
    objects: Array<GameObject | ScrollingBackground>
    assets: {[index: string]: HTMLImageElement}
    canvas: Canvas
    
    board: MinesweeperBoard
    timer: NumberDisplay
    mineCount: NumberDisplay
    face: any
    faceState: number
    finishTime: number

    constructor(canvas: Canvas, assets: {[index: string]: HTMLImageElement}) {
        super();

        this.canvas = canvas
        this.board = new MinesweeperBoard(assets)
        this.face = {
            face: new GameObjectAnimated([375,50], [50, 50], 0, assets['faces'], [17,17]),
            faceButton: new GameObjectAnimated([360,35], [80, 80], 0, assets['face-button'], [26,26]),
            easyButton: new GameObjectAnimated([280,35], [80, 26], 0, assets['diff-button'], [80,26]),
            medButton: new GameObjectAnimated([280,62], [80, 26], 0, assets['diff-button'], [80,26]),
            hardButton: new GameObjectAnimated([280,89], [80, 26], 0, assets['diff-button'], [80,26]),
            state: 0,
            highlightState: 0,
        }
        this.faceState = 0
        this.finishTime = -1
        this.board.generate(16,16,40)

        this.timer = new NumberDisplay(assets, 3)
        this.mineCount = new NumberDisplay(assets, 3)

        this.objects = []

        this.objects.push()

        this.assets = assets
    }

    activate() {
        //
    }

    reset() {
        //
    }

    restart(diff: number) {
        this.timeActive = 0
        this.faceState = 0
        this.face.state = 0
        this.board.state = 0
        switch(diff) {
            case(0):
            this.board.generate(9,8,10)
                break;
            case(1):
            this.board.generate(16,16,40)
                break;
            case(2):
                this.board.generate(25,15,70)
                break;
        }
        
    }

    render(canvas: Canvas) {
        this.objects.forEach((object) => {
            object.render(canvas.ctx, Math.floor(this.timeActive/20))
        })
        this.board.render(canvas.ctx)
        this.face['faceButton'].render(canvas.ctx,     (this.face.highlightState == 1 ? 1 : 0))
        if (this.face.state != 0) {
            this.face['easyButton'].render(canvas.ctx, (this.face.highlightState == 2 ? 1 : 0))
            canvas.ctx.fillStyle = 'black'
            canvas.ctx.fillText('Easy', 290, 53)
            this.face['medButton'].render(canvas.ctx,  (this.face.highlightState == 3 ? 1 : 0))
            canvas.ctx.fillText('Medium', 290, 80)
            this.face['hardButton'].render(canvas.ctx, (this.face.highlightState == 4 ? 1 : 0))
            canvas.ctx.fillText('Hard', 290, 107)
        }
        this.face['face'].render(canvas.ctx, this.faceState)
        this.timer.render(canvas.ctx, [10,40], this.board.state == 0 ? Math.floor(this.timeActive/1000) : this.finishTime)
        this.timer.render(canvas.ctx, [600,40], this.board.numMines-this.board.numFlags)

        
    }

    update(deltaTime: number) {
        super.update(deltaTime)

        this.objects.forEach((object) => {
            object.update(deltaTime)
        })
    }

    updateInput(inputManager: InputManager) {
        super.updateInput(inputManager);

        if (inputManager.clicking && inputManager.mousePos[0] > 360 && inputManager.mousePos[0] < 440 && inputManager.mousePos[1] > 35 && inputManager.mousePos[1] < 115) {
            this.face.highlightState = 1
        } else if (inputManager.clicking && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 35 && inputManager.mousePos[1] < 61) {
            this.face.highlightState = 2
        } else if (inputManager.clicking && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 62 && inputManager.mousePos[1] < 88) {
            this.face.highlightState = 3
        } else if (inputManager.clicking && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 89 && inputManager.mousePos[1] < 115) {
            this.face.highlightState = 4
        } else {
            this.face.highlightState = 0
        }

        if (this.board.state == 0) {
            if (inputManager.clicking) { 
                this.faceState = 1
            } else {
                this.faceState = 0
            }
        }
        if (inputManager.leftClicked) {
            if (this.board.state == 0) {this.board.revealTile(inputManager.mousePos); this.finishTime = Math.floor(this.timeActive/1000)}
            if (this.board.state == 2) this.faceState = 3
            if (inputManager.mousePos[0] > 360 && inputManager.mousePos[0] < 440 && inputManager.mousePos[1] > 35 && inputManager.mousePos[1] < 115) {
                if (this.face.state == 1) {
                    this.face.state = 0
                } else if (this.face.state == 0) {
                    this.face.state = 1
                }
            }
            if (this.face.state == 1 && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 35 && inputManager.mousePos[1] < 61) this.restart(0)
            if (this.face.state == 1 && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 62 && inputManager.mousePos[1] < 88) this.restart(1)
            if (this.face.state == 1 && inputManager.mousePos[0] > 280 && inputManager.mousePos[0] < 360 && inputManager.mousePos[1] > 89 && inputManager.mousePos[1] < 115) this.restart(2)
        }
        if (inputManager.rightClicked) {
            if (this.board.state == 0) this.board.placeFlag(inputManager.mousePos)
            if (this.board.state == 1) this.faceState = 2
        }

        this.canvas.ctx.fillRect(inputManager.mousePos[0], inputManager.mousePos[1], 2, 2)
    }
}