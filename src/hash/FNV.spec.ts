import {expect} from 'chai';
import 'mocha';
import {FNV} from "./FNV";

describe('FNV', () => {

    it('should be created', () => {
        const result = new FNV();
        expect(result).to.not.equal(null);
    });

    it('should have initial offset', () => {
        const result = new FNV();
        expect(result.digest("hex")).to.equal("811c9dc5");
    });

    it('should create a hash', () => {
        const result = new FNV();
        expect(result.update(new Buffer("testme123")).digest("hex")).to.equal("24a34ae3");
    });

    it('should create a hash with fnv_b', () => {
        const result = new FNV();
        //new instance
        let newRes = result.updateB(result.update(new Buffer("testme123")));
        expect(result).to.not.equal(newRes);
        expect(newRes.digest("hex")).to.equal("3c6df896");
    });


    it('should create a hash', () => {
        const result = new FNV();
        const result2 = new FNV();
        expect(result.update(new Buffer("testme123")).digest("hex")).to.equal(result2.update(new Buffer("testme123")).digest("hex"));
    });
});