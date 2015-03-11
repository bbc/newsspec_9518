define(['lib/news_special/bootstrap', 'lib/news_special/iframemanager__frame', 'lib/vendors/d3/topojson', 'backbone', 'models/map', 'views/mapWrapper', 'text!maps/uk.topojson'], function (news, iframeManager, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson) {
    /* Values passed from parent on load. (Query string) */
    var isResultsMode = (iframeManager.getValueFromQueryString('isResultsMode').toLowerCase() === 'true'),
        parentWidth = iframeManager.getValueFromQueryString('parentWidth');



    mapTopoJson = JSON.parse(mapTopoJson);

    var mapConfig = {
        'isResultsMode': isResultsMode,
        'translate': [365, 2377],
        'mapScale': 1993,
        'bounds': [[-300, -400], [775, 575]],
        'pulloutShetland': true,
        'repIreland': true,
        'locator': true,
        'tooltip': true,
        'interactive': (parentWidth > 700)
    };

    var Router = Backbone.Router.extend({
        routes: {
            'nation/:nation': 'nation',
            'constituency/:gssid': 'constituency',
            '*default': 'ukMap'
        },

        ukMap: function () {
            this.loadMap(mapConfig);
        },
        nation: function (nation) {
            var nationInfo;
            switch (nation) {
            case 'england':
                nationInfo = {
                    'scale': 1.55,
                    'center': [277, 207],
                    'pulloutShetland': false
                };
                break;
            case 'northernIreland':
                nationInfo = {
                    'scale': 4.48,
                    'center': [121, 106],
                    'pulloutShetland': false
                };
                break;
            case 'scotland':
                nationInfo = {
                    'scale': 1.2,
                    'center': [180, 30],
                    'pulloutShetland': false
                };
                break;
            case 'wales':
                nationInfo = {
                    'scale': 4,
                    'center': [220, 233],
                    'pulloutShetland': false
                };
                break;
            }

            this.loadMap(_.extend(mapConfig, nationInfo));
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