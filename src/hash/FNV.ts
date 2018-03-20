import _ = require("lodash");
// https://tools.ietf.org/html/draft-eastlake-fnv-04
// https://github.com/jasondavies/bloomfilter.js/blob/master/bloomfilter.js
const OFFSET_BASIS = 0x811C9DC5;

export class FNV {

    private _hash;

    constructor(pre: number = OFFSET_BASIS) {
        this._hash = pre;
    }

    public update(data: Buffer) {
        _.forEach(data, (i) => {
            this._hash = this.fnvMult(this._hash ^ i & 0xff00);
            this._hash = this.fnvMult(this._hash ^ i & 0xff);
        });
        return this;
    }

    public updateB(hash: FNV) {
        let b = this.fnvMix(this.fnvMult(hash.value));
        return new FNV(this.fnvMix(b));
    }

    public fnvMult = (val) => {
        return val + (val << 1) + (val << 4) + (val << 7) + (val << 8) + (val << 24);
    };

    public fnvMix = (val) => {
        val += val << 13;
        val ^= val >>> 7;
        val += val << 3;
        val ^= val >>> 17;
        val += val << 5;
        return val & 0xffffffff;
    };

    public digest(encoding?: string) {
        encoding = encoding ? encoding : "binary";
        let buffer = new Buffer(4);
        buffer.writeInt32BE(this._hash & 0xffffffff, 0);
        return buffer.toString(encoding);
    }

    public get value() {
        return this._hash & 0xffffffff;
    }

    public reset() {
        this._hash = OFFSET_BASIS;
    }
}