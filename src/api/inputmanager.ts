export class InputManager {
    keys: {[index: string]: boolean}
    clicking: boolean
    mousePos: number[]
    mouseSensitivity: number
    leftClicked: boolean
    rightClicked: boolean
    constructor() {     
        window.addEventListener('mousemove', this.mousemoveListener.bind(this));
        window.addEventListener('keydown', this.keydownListener.bind(this));
        window.addEventListener('keyup', this.keyupListener.bind(this));
        window.addEventListener('mousedown', this.mousedownListener.bind(this));
        window.addEventListener('mouseup', this.mouseupListener.bind(this));
        window.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault())
        this.clicking = false
        this.keys = {}
        this.mousePos = [0,0]
        this.mouseSensitivity = 0.002
        this.leftClicked = false
        this.rightClicked = false
    }

    mousemoveListener(e: MouseEvent) {
        this.mousePos = [e.x-10, e.y-10]
    }

    keydownListener(e: KeyboardEvent) {
        switch (e.key) {
            case (' '):
                if (!e.repeat) {
                    this.keys[' '] = true;
                }
                break;
        }
    }

    keyupListener(_e: KeyboardEvent) {

    }

    mousedownListener(e: MouseEvent) {
        e.preventDefault()
        if (e.button == 0) this.clicking = true
    }

    mouseupListener(e: MouseEvent) {
        if (e.button == 0) {this.leftClicked = true}
        if (e.button == 2) {this.rightClicked = true}
        this.clicking = false
    }

    updateInput() {
        this.leftClicked = false
        this.rightClicked = false
        this.keys[' '] = false;
    }
}