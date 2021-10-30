// Override Settings
var boostPFSInstantSearchConfig = {
    search: {
      	suggestionMobileStyle: 'style2'
    }
}; 

// Override Settings
(function () {  // Add this
	BoostPFS.inject(this);  // Add this

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function(suggestionElement, searchElement, searchBoxId) {  
	};

	// BoostPFS.prototype.buildSearchResultHeader = function(data){
	// 	jQ('.boost-pfs-filter-breadcrumb').each(function(index, breadcrumb) {
	// 		var html = jQ(breadcrumb).html();
	// 		html = html.replace(/{{terms}}/, Globals.queryParams.q)
	// 		jQ(breadcrumb).html(html);
	// 		jQ(breadcrumb).removeClass('hidden');
	// 	})	
	// };

	// InstantSearch.prototype.beforeInit = function (id) {
	// 	if (Settings.getSettingValue('search.enableSuggestion')) {

	// 		//Remove theme's instant search
	// 		removeThemeSearchEvent();

	// 		var self = this;
	// 		if (typeof id === 'undefined') {
	// 			jQ('input[name="' + this.searchTermKey + '"]').each(function (i) {
	// 				if (!jQ(this)[0].hasAttribute('data-no-bc-search')) {
	// 					var id = 'boost-pfs-search-box-' + i;
	// 					jQ(this).attr('id', id);
	// 					self.buildSearchBox('#' + id)
	// 				}
	// 			});
	// 		} else {
	// 			this.buildSearchBox(id);
	// 		}
	// 		if (this.isMobile()) {
	// 			// Clear cache when going back from another page
	// 			window.onpageshow = function (event) {
	// 				if (event.persisted) {
	// 					window.location.reload();
	// 				}
	// 			};
	// 			// Build Suggestion mobile on top
	// 			if (Settings.getSettingValue('search.suggestionMobileStyle') == 'style1') {
	// 				this.buildSuggestionMobile();
	// 			}
	// 		}
	// 	}
	// };

	// function removeThemeSearchEvent() {
	// 	// Remove all events
	// 	if (jQ('.header__search-bar-wrapper').length > 0) {
	// 		var cloneSearchBar = jQ('.header__search-bar-wrapper:first').clone();
	// 		jQ('.header__search-bar-wrapper').replaceWith(cloneSearchBar);
	// 		jQ('.search-bar__filter').hide();
	// 	}
	// 	// Rebuild some event
	// 	if (jQ('[data-action="toggle-search"]').length > 0) {
	// 		jQ('[data-action="toggle-search"]').on('click', function () {
	// 			jQ('.header__search-bar-wrapper').toggleClass('is-visible');
	// 		})
	// 	}
	// 	if (jQ('[data-action="clear-input"]').length > 0) {
	// 		jQ('[data-action="clear-input"]').on('click', function () {
	// 			jQ('input[name="' + bcsffilter.searchTermKey + '"]').val('');
	// 		})
	// 	}
	// }
	
  	InstantSearchApi.afterCallAsync = function(result, callbackInstantSearchApi) {
      /* Call 3rd party api */
      if (typeof window.Locksmith === 'object' && result.products.length > 0) {
      var URLs = []
      var URLsCollection = []
      var totalUrls = []
      var grantedAccess = []
      var grantedAccessCollection = []
      //Create an array of products URLs
      for(var i = 0; i < result.products.length; i ++){
          URLs.push('/products/' + result.products[i].handle);
      }
      for(var i = 0; i < result.collections.length; i ++){
          URLsCollection.push('/collections/' + result.collections[i].handle);
      }
      totalUrls = URLs.concat(URLsCollection)
      jQ.ajax({
          method: 'GET',
          url: '/apps/locksmith/api/resources',
          data: { urls: totalUrls,},
          timeout: 4000,
          success: function(response) {
              var resources = JSON.parse(response);
              for(var i = 0; i < URLs.length; i ++){
                  //Checks that the response exists
                  if(resources[URLs[i]]){
                  //Checks that the access of the product has been granted
                  if(resources[URLs[i]].access_granted){
                      //If the product is accesible add it to the array of the products
                      grantedAccess.push(result.products[i])
                  }
                  }
              }
              //Change array of products
              result.products = grantedAccess;
              //Same for collections
              for(var i = 0; i < URLsCollection.length; i ++){
                  //Checks that the response exists
                  if(resources[URLsCollection[i]]){
                  //Checks that the access of the product has been granted
                  if(resources[URLsCollection[i]].access_granted){
                      //If the product is accesible add it to the array of the products
                      grantedAccessCollection.push(result.collections[i])
                  }
                  }
              }
              //Change array of collections
              result.collections = grantedAccessCollection;
              /* Build everything after getting instant search data */
              callbackInstantSearchApi(result);
          },
          error: function() {
              /* Build everything after getting instant search data */
              callbackInstantSearchApi(result);
          },
      });
      } else {
          callbackInstantSearchApi(result);
      }
  }
  
})();  // Add this at the end

