import { GameObjectAnimated } from "../api/object";

export class MinesweeperBoard {
    tile: GameObjectAnimated
    grid: number[][]
    revealedTiles: number[]
    fatalBomb: number[]
    numMines: number
    numFlags: number
    state: number

    constructor(assets: {[index: string]: HTMLImageElement}) {
        this.tile = new GameObjectAnimated([0,0], [30,30], 0, assets['tiles'], [16,16])
        this.grid = []
        this.revealedTiles = []
        this.fatalBomb = [0,0]
        this.numFlags = 0
        this.numMines = 0
        this.state = 0
    }

    generate(width: number, height: number, mines: number) {
        this.numFlags = 0
        if (width > 25) width = 25;
        if (width < 5) width = 5
        if (height > 15) height = 15;
        if (height < 5) height = 5
        if (mines > width*height || mines > 100) mines = width*height
        this.numMines = mines
        this.grid = Array(height).fill(0).map(_x => Array(width).fill(0))
        this.revealedTiles = Array(width*height).fill(0)
        let i = 0;
        while (i < this.numMines) {
            const y = Math.floor(Math.random() * height)
            const x = Math.floor(Math.random() * width)
            if (this.grid[y][x] != 1) {
                this.grid[y][x] = 1
                i++
            }
        }
    }

    countNeighbors(position: number[]) {
        let neighbors = 0
        for(let k = -1; k <= 1; k++) {
            for(let l = -1; l <= 1; l++) {
                if (!(k == 0 && l == 0) && position[1]+k >= 0 && position[1]+k < this.grid.length && position[0]+l >= 0 && position[0]+l < this.grid[0].length) {
                    neighbors += this.grid[position[1]+k][position[0]+l]
                }
            }
        }
        return neighbors
    }

    checkWin() {
        let wrongFlags = false
        this.grid.forEach((row, j) => {
            row.forEach((cell, i) => {
                if (cell == 1 && this.revealedTiles[j*this.grid[0].length+i] != 2) {
                    wrongFlags = true
                }
            })
        })
        return !wrongFlags
    }

    render(ctx: CanvasRenderingContext2D) {
        this.grid.forEach((row, j) => {
            row.forEach((cell, i) => {
                let tile = -1
                this.tile.position = [(800-this.grid[0].length*30)/2+i*30, 600-this.grid.length*30+j*30]
                switch(this.state) {
                    case(0):
                        if (this.revealedTiles[j*this.grid[0].length+i] == 1) {
                            if (cell == 1) {
                                tile = 5
                            } else {
                                const neighbors = this.countNeighbors([i,j])
                                if (neighbors == 0) {tile = 1} else {tile = neighbors + 7}
                            }
                        } else if (this.revealedTiles[j*this.grid[0].length+i] == 0) {
                            tile = 0
                        } else if (this.revealedTiles[j*this.grid[0].length+i] == 2) {
                            tile = 2
                        } else if (this.revealedTiles[j*this.grid[0].length+i] == 3) {
                            tile = 3
                        }
                        break;
                    case(1):
                        if (cell == 1) {
                            tile = 5
                        } else {
                            const neighbors = this.countNeighbors([i,j])
                            if (neighbors == 0) {tile = 1} else {tile = neighbors + 7}
                        }
                        break;
                    case(2):
                        if (cell == 1) {
                            if (this.fatalBomb[0] == i && this.fatalBomb[1] == j) {
                                tile = 6
                            } else {
                                tile = 5
                            }
                        } else {
                            const neighbors = this.countNeighbors([i,j])
                            if (neighbors == 0) {tile = 1} else {tile = neighbors + 7}
                        }
                        break;
                }
                
                
                this.tile.render(ctx, tile)
            })
        })
    }

    revealTile(pos: number[]) {
        if (pos[0] > (800-this.grid[0].length*30)/2 && pos[0] < 800-(800-this.grid[0].length*30)/2 && pos[1] > 600-this.grid.length*30 && pos[1] < 600) {
            const x = Math.floor((pos[0]-(800-this.grid[0].length*30)/2)/30)
            const y = Math.floor((pos[1]-600+this.grid.length*30)/30)
            if (this.countNeighbors([x,y]) == 0) this.revealSafeTiles([x,y])
            if (this.revealedTiles[y*this.grid[0].length+x] == 0) this.revealedTiles[y*this.grid[0].length+x] = 1
            if (this.grid[y][x] == 1) {
                this.state = 2
                this.fatalBomb = [x,y]
            }
        }
    }

    revealSafeTiles(pos: number[]) {
        if (pos[0] >= 0 && pos[1] >= 0 && pos[0] < this.grid[0].length && pos[1] < this.grid.length) {
            if (this.countNeighbors([pos[0], pos[1]]) == 0 && this.revealedTiles[pos[1]*this.grid[0].length+pos[0]] == 0) {
                this.revealedTiles[pos[1]*this.grid[0].length+pos[0]] = 1
                this.revealSafeTiles([pos[0]+1, pos[1]])
                this.revealSafeTiles([pos[0]-1, pos[1]])
                this.revealSafeTiles([pos[0], pos[1]+1])
                this.revealSafeTiles([pos[0], pos[1]-1])
            } else {
                this.revealedTiles[pos[1]*this.grid[0].length+pos[0]] = 1
            }
        }
        return;
    }

    placeFlag(pos: number[]) {
        if (pos[0] > (800-this.grid[0].length*30)/2 && pos[0] < 800-(800-this.grid[0].length*30)/2 && pos[1] > 600-this.grid.length*30 && pos[1] < 600) {
            const x = Math.floor((pos[0]-(800-this.grid[0].length*30)/2)/30)
            const y = Math.floor((pos[1]-600+this.grid.length*30)/30)
            if (this.revealedTiles[y*this.grid[0].length+x] == 0) {
                this.revealedTiles[y*this.grid[0].length+x] = 2;
                this.numFlags++;
                if (this.numMines-this.numFlags == 0 && this.checkWin()) {
                    this.state = 1
                }
            }
            else if (this.revealedTiles[y*this.grid[0].length+x] == 2) {this.revealedTiles[y*this.grid[0].length+x] = 3; this.numFlags--; }
            else if (this.revealedTiles[y*this.grid[0].length+x] == 3) {this.revealedTiles[y*this.grid[0].length+x] = 0; }
        }
    }
}