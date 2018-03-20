import {FNV} from "../hash/FNV";
import _ = require("lodash");

export interface BloomConfig {
    estSize: number,
    fp: number
}

export class BloomFilter {

    private _bitv: Int32Array;
    private _fnv: FNV;
    private _k: number;
    private _m: number;
    private _n: number;


    constructor(config: BloomConfig) {
        this._m = BloomFilter.bitArrayCount(config.estSize, config.fp);
        this._k = BloomFilter.hashFunctionCount(this._m, config.estSize);
        this._n = config.estSize;
        this._bitv = new Int32Array(this._m);
        this._fnv = new FNV();
    }

    public addToFilter(data: any) {
        let slots = this.slots(data);
        _.forEach(slots, (slot) => {
            this._bitv[slot] = 1;
        });
    }

    public test(data: any) {
        let slots = this.slots(data);
        let result = true;
        // todo dont use lodash and break right away
        _.forEach(slots, (slot) => {
            if (this._bitv[slot] === 0) {
                result = false;
            }
        });
        return result;
    }

    public slots(data: any) {
        this._fnv.reset();
        this._fnv.update(new Buffer(data + "")).digest();
        let a = this._fnv.value;
        let b = this._fnv.updateB(this._fnv).value;
        let slots = [];
        let slot = a % this._m;
        for (let i = 0; i < this._k; ++i) {
            slots[i] = slot < 0 ? (slot + this._m) : slot;
            slot = (slot + b) % this.m;
        }
        return slots
    }

    //https://corte.si/posts/code/bloom-filter-rules-of-thumb/index.html
    public static bitArrayCount(n: number, p: number) {
        return Math.ceil((n * Math.log(p)) / Math.log(1.0 / Math.pow(2.0, Math.log(2.0))));
    }

    //https://corte.si/posts/code/bloom-filter-rules-of-thumb/index.html
    public static hashFunctionCount(m: number, n: number) {
        return Math.round(Math.log(2.0) * m / n);
    }


    get k(): number {
        return this._k;
    }

    get m(): number {
        return this._m;
    }

    get n(): number {
        return this._n;
    }

    get vector(): any {
        return this._bitv;
    }
}