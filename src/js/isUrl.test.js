const {isUrl} = require('./isUrl.js'); 
describe('isUrl function', () => {
    it('should return true for URLs:', () => {
        expect(isUrl('https://google.com/')).toBe(true);
        expect(isUrl('http://google.com/')).toBe(true);
    });
    it('should assume all string starting from www as a valid url', () => {
        expect(isUrl('www.google.com')).toBe(true);
    });
    it('should return false for NOT URLs:', () => {
        expect(isUrl('NOT A VALID URL!')).toBe(false);
    });
})