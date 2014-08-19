
describe 'getIdFromURL', ->
    $injector = angular.injector ['youtube-embed']
    getIdFromURL = $injector.get('youtubeEmbedUtils').getIdFromURL

    it 'should handle regular query strings', ->
        url = 'https://www.youtube.com/watch?v=nViWpVc1x_4&feature=youtu.be'
        id = 'nViWpVc1x_4'
        expect(getIdFromURL(url)).toBe id

    it 'should handle attribution_link', ->
        url = 'http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
        id = 'dPdgx30w9sU'
        expect(getIdFromURL(url)).toBe id

    it 'should handle almost a query string', ->
        url = 'http://www.youtube.com/watch?feature=player_detailpage&amp;v=93LvTKF_jW0#t=1'
        id = '93LvTKF_jW0'
        expect(getIdFromURL(url)).toBe id

    it 'should handle "&amp;feature=youtu.be"', ->
        url = 'https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be'
        id = 'VbNF9X1waSc'
        expect(getIdFromURL(url)).toBe id
