define(['lib/news_special/bootstrap', 'lib/news_special/iframemanager__frame', 'lib/vendors/d3/topojson', 'backbone', 'models/map', 'views/mapWrapper', 'text!maps/wales.topojson'], function (news, iframeManager, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson) {
    
    /* Values passed from parent on load. (Query string) */
    var isResultsMode = (iframeManager.getValueFromQueryString('isResultsMode').toLowerCase() === 'true'),
        parentWidth = iframeManager.getValueFromQueryString('parentWidth');

    mapTopoJson = JSON.parse(mapTopoJson);

    var mapConfig = {
        'isResultsMode': isResultsMode,
        'translate': [800, 8852],
        'mapScale': 7972,
        'maxScaleOut': 1,
        'bounds': [[-85, -84], [580, 550]],
        'pulloutShetland': false,
        'locator': true,
        'scale': 1,
        'center': [250, 250],
        'locatorCenter': [250, 250],
        'tooltip': true,
        'interactive': (parentWidth > 700)
    };

    var Router = Backbone.Router.extend({
        routes: {
            'constituency/:gssid': 'constituency',
            '*default': 'welshMap'
        },

        welshMap: function () {
            this.loadMap(mapConfig);
        },
        constituency: function (constituency) {
            var constituencyInfo = {
                'gssid': constituency
            };

            this.loadMap(_.extend(mapConfig, constituencyInfo));
        },
        loadMap: function (config) {
            var features = Topojson.feature(mapTopoJson, mapTopoJson.objects['boundaries']).features;
            config.features = features;

            this.addMapWrapper(config);
        },
        addMapWrapper: function (config) {
            var container = news.$('.main'),
                mapModel = new MapModel(config),
                mapWrapper = new MapWrapper({mapModel: mapModel});

            container.html(mapWrapper.render());
        }
    });

    var appRouter = new Router();
    Backbone.history.start();

    news.sendMessageToremoveLoadingImage();
});