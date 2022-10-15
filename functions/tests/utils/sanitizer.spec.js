const md5 = require('md5');
const {renameFile} = require('../../utils/sanitizer');

describe('renameFile', () => {
  it('Doit retourner un nom de fichier haché (.png)', () => {
    // ARRANGE
    const url = 'https://nico-develop.com/nom-logo.png';
    const hashUrl = md5(url);

    // ACT
    const {filename} = renameFile(url, md5);

    // ASSERT
    expect(filename).toEqual(`${hashUrl}.png`);
  });

  it('Doit retourner un nom de fichier haché (.jpg)', () => {
    // ARRANGE
    const url = 'https://nico-develop.com/nom-logo.jpg';
    const hashUrl = md5(url);

    // ACT
    const {filename} = renameFile(url, md5);

    // ASSERT
    expect(filename).toEqual(`${hashUrl}.jpg`);
  });
});
