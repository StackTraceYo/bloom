import {expect} from 'chai';
import 'mocha';
import {BloomFilter} from "./BloomFilter";
import _ = require('lodash');

describe('BloomFilter', () => {

    it('should be created', () => {
        const result = new BloomFilter({estSize: 1000, fp: .2});
        expect(result).to.not.equal(null);
        expect(result.n).to.equal(1000);
        expect(result.m).to.equal(3350);
        expect(result.k).to.equal(2);
    });

    // https://hur.st/bloomfilter
    it('should be created with large number', () => {
        const result = new BloomFilter({estSize: 40000000, fp: .000001});
        expect(result).to.not.equal(null);
        expect(result.n).to.equal(40000000);
        expect(result.m).to.equal(1150207006);
        expect(result.k).to.equal(20);
        expect(result.vector.length).to.equal(result.m);
        expect(result.vector[12312]).to.equal(0);
    }).timeout(20000);

    it('should find correct slots', () => {
        const result = new BloomFilter({estSize: 40000000, fp: .000001});
        let expected = [
            201988051,
            525243995,
            848499939,
            21548877,
            344804821,
            668060765,
            991316709,
            164365647,
            487621591,
            810877535,
            1134133479,
            307182417,
            630438361,
            953694305,
            126743243,
            449999187,
            773255131,
            1096511075,
            269560013,
            592815957
        ];
        let ans = result.slots("asdasd");
        _.forEach(ans, (x) => {
            expect(expected.indexOf(x)).to.not.equal(-1);
        })

    });

    it('should add data', () => {
        const result = new BloomFilter({estSize: 40000000, fp: .000001});
        result.addToFilter("testtest");
        expect(result.test("abc")).to.equal(false);
        expect(result.test("testtest")).to.equal(true);
    });

});