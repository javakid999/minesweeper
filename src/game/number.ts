import { GameObjectAnimated } from "../api/object";

export class NumberDisplay {
    number: GameObjectAnimated
    digits: number

    constructor(assets: {[index: string]: HTMLImageElement}, digits: number) {
        this.digits = digits
        this.number = new GameObjectAnimated([0,0], [39,69], 0, assets['numbers'], [13,23])
    }

    render(ctx: CanvasRenderingContext2D, position: number[], num: number) {
        this.number.position = position
        let nums = num.toString().split('').map(parseFloat);
        if (nums.length > this.digits) {nums = nums.slice(nums.length-this.digits)}
        for (let i = 0; i < this.digits; i++) {
            this.number.position[0] += this.number.size[0]
            if (i < this.digits-nums.length) {
                this.number.render(ctx, 9)
            } else {
                this.number.render(ctx, (nums[i-this.digits+nums.length]+9)%10);
            }
        }
    }
}