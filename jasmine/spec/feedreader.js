// feedreader.js

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
  describe('RSS Feeds', function() {
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

    it('has each feed\'s URL defined, and the URL is non-empty', function() {
      var allDefined = true,
          allNonEmpty = true;

      allFeeds.forEach(function(feed) {
        if(typeof feed.url === 'undefined') allDefined = false; // if any feed doesn't have url defined, the whole test fails
        if(feed.url === '') allNonEmpty = false; // if any feed has empty url, the whole test fails
      });

      expect(allDefined && allNonEmpty).toBe(true);
    });

    it('has each feed\'s name defined, and the name is non-empty', function() {
      var allDefined = true,
          allNonEmpty = true;

      allFeeds.forEach(function(feed) {
        if(typeof feed.name === 'undefined') allDefined = false; // same technique as url test above
        if(feed.name === '') allNonEmpty = false;
      });

      expect(allDefined && allNonEmpty).toBe(true);
    });
  });

  describe('The menu', function() {
    it('is hidden by default', function() {
      expect($('body').hasClass('menu-hidden')).toBe(true); // menu is displayed/hidden using CSS translation/transformation
    });

    it('changes visibility when menu icon is clicked', function() {
      var body = $('body'),
          menuIcon = $('.menu-icon-link');

      menuIcon.trigger('click'); // use jQuery to simulate click
      expect(body.hasClass('menu-hidden')).toBe(false);
      menuIcon.trigger('click');
      expect(body.hasClass('menu-hidden')).toBe(true);
    });
  });

  describe('Initial Entries', function() {
    var feed = $('.feed');

    beforeEach(function(done) { // asynchrnously load feed before testing, not assuming feed has been loaded
      loadFeed(0, function() {
        done();
      });
    });

    it('are loaded, with at least one entry, from the default feed', function(done) {
      expect(feed.find('.entry').length).not.toBe(0); // check if there is more than 0 entry
      done();
    });
  });

  describe('New Feed Selection', function() {
    var oldFeed,
        newFeed;

    /* Add feed entries in case allFeeds has fewer than two items, preventing out of bound array access */
    allFeeds.push({name: 'Wait But Why', url: 'http://waitbutwhy.com/feed'});
    allFeeds.push({name: 'XKCD', url: 'http://xkcd.com/rss.xml'});

    beforeEach(function(done) {
      loadFeed(1, function() {
        oldFeed = $('.feed').find('h2').first().text();

        loadFeed(0, function() { // nesting ensures that the first feed has been loaded
          newFeed = $('.feed').find('h2').first().text();
          done();
        });
      });
    });

    it('changes feed content', function(done) {
      expect(oldFeed).not.toEqual(newFeed);
      done();
    });

    /* Pop them out as if they're never there */
    allFeeds.pop();
    allFeeds.pop();
  });
}());