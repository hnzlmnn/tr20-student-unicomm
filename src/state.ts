export default class State {
    private _step: number = 0

    get step() {
        return this._step
    }

    get welcomed() {
        return this._step > 1
    }

    get solved() {
        return this._step > 2
    }

    next() {
        this._step++
    }

    prev() {
        this._step--
    }

    set(step: number) {
        this._step = step
    }


}
