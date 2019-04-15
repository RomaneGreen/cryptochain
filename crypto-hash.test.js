const cryptoHash = require('./crypto-hash')


describe('cryptoHash',() => {


    it('generates a SHA-256 code',() => {

        expect(cryptoHash('foco')).toEqual('0100101010111001101100101011110111010100001101101001101101111111011010100010000110100010111001100110001001011011001011101010001001101000100100111101010011010001111010010001111001110000000010101000111010100000010111110000111011101100010100011110010001111111')
    })

    it('produces same has with same input arguments in any order',() => {
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'))
    })

})