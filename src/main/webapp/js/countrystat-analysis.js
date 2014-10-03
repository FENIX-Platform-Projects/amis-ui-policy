App = {

    mapBuildier: function(id) {
        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }

        var mapOptions = {
            zoomControl:false,
            attributionControl: false
        };


        var m = new FM.Map(id, options, mapOptions);
        m.createMap();

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST_NASA_AERIAL','EN' );
        m.addTileLayer(tile, true);

        return m;
    },

    init : function(id) {        
        return App.createMap1(id);
    },

    createMap1:function (id) {

        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }

        var mapOptions = {
            zoomControl:false,
            attributionControl: false
        };


        var m = new FM.Map(id, options, mapOptions);
        m.createMap();

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST_NASA_AERIAL','EN' );
        m.addTileLayer(tile, true);


        // COUNTRYSTAT LAYER
        var layer = {};
        layer.layers='gaul1_3857'
        layer.styles=''
        layer.layertitle='Countrystat Cassava Production - 2001'
        layer.joincolumn='adm1_code'
        layer.joindata='[{"1041":"3483"},{"40695":"1359"},{"40694":"2059"}]'
        //layer.joindata='[["1041","3483"],["40695","1359"],["40694","2059"]]'
        //layer.joindata='[(1041,3483),(40695,1359),(40694,2059)]'
        layer.colorramp='Reds'
        layer.intervals='4'
        layer.addborders='true'
        layer.borderscolor='000000'
        layer.bordersstroke='1.0'
        layer.bordersopacity='0.5'
        layer.legendtitle='Tonnes'
        layer.legendsubtitle='2001'
        //     layer.mu='ha'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.layertype = 'JOIN';
        layer.lang='e';
        layer.jointype='shaded';
        layer.measurementunit = 'Tonnes';
        // layer.openlegend = true;
        /** TODO: use layer.gui.switchjointype instead of layer.switchjointype **/
        layer.gui = {};
        layer.switchjointype = false;
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '66',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addShadedLayer(l);


        // JOIN LAYER
         var layer = {};
        //layer.joindata = '[(1,1290.667),(2,8179.959),(3,2325.163),(4,7432.631),(5,0.819),(7,5188.298),(8,36.239),(9,101276.026),(10,95528.009),(11,5857.891),(12,17.062),(13,46.616),(14,65.789),(15,7166.042),(16,58302.945),(17,2.578),(18,474.149),(19,15937.864),(20,3217.645),(21,336353.69),(22,1.9180000000000001),(23,140.821),(25,33.435),(26,49.548),(27,4465.658),(28,42317.386),(29,865.749),(32,8066.075),(33,36532.525),(35,94.377),(36,3.305),(37,4387.376),(38,4916.412),(39,9416.854),(40,10234.164),(41,522364.021),(44,50415.848),(45,187.862),(46,264.894),(47,2.7199999999999998),(48,3262.985),(49,9868.325),(50,334.26),(51,8337.017),(52,5320.167),(53,2381.933),(54,7087.516),(55,34.996),(56,5580.476),(57,11760.21),(58,11883.854),(59,22683.655),(60,2625.779),(61,16.732),(62,28727.468),(63,899.804),(64,20.757),(65,140.845),(66,793.663),(67,3694.165),(68,60659.5),(69,65.143),(70,24.887),(72,565.479),(73,2662.904),(74,140.385),(75,662.054),(79,46866.893),(80,1400.309),(81,3224.471),(83,1.858),(84,7239.469),(85,4.456),(86,12.676),(87,144.34),(88,1.389),(89,5469.25),(90,5579.662),(91,1101.739),(93,3141.915),(95,4491.726),(96,19.865),(97,5271.123),(98,2190.133),(99,380.688),(100,508261.089),(101,94877.394),(102,37521.892),(103,5816.421),(104,15952.075),(105,1155.018),(106,26977.114),(107,2822.185),(108,14403.894),(109,805.538),(110,20175.566),(112,861.339),(113,2853.415),(114,22929.481),(115,12337.724),(116,5242.938),(117,11853.839),(118,327.416),(119,1426.341),(120,4957.428),(121,534.613),(122,1226.291),(123,228.081),(124,2067.829),(125,13.914),(126,2698.239),(128,26.723),(129,17102.101),(130,1978.131),(131,7610.817),(132,0.178),(133,12466.539),(134,63.171),(135,76.041),(136,5553.445),(137,150.034),(138,70337.973),(141,9860.98),(142,19.484),(143,10519.213),(144,2847.059),(145,29.856),(146,1747.631),(147,3598.287),(148,0.142),(149,15853.75),(150,13017.411),(151,6.459),(153,220.124),(154,1060.004),(155,300.128),(156,34867.964),(157,5921.616),(158,12622.234),(159,39389.157),(160,0.404),(162,3351.416),(164,17.645),(165,92287.043),(166,2779.095),(167,5338.87),(168,315.611),(169,17110.641),(170,18774.485),(171,40853.49),(173,22728.946),(174,5246.627),(175,885.537),(176,470.397),(177,776.656),(178,3148.19),(179,191.667),(181,7846.047),(182,142.204),(183,13196.057),(184,1449.317),(185,83040.03),(186,4904.201),(187,1.442),(188,15.373),(189,42.028),(190,0.148),(191,18.834),(192,1.13),(193,8.999),(194,5105.592),(195,5677.828),(196,7.443),(197,1279.513),(198,1199.936),(199,2266.243),(200,49.149),(201,17793.969),(202,25928.401),(203,28372.677),(205,141.375),(206,62955.36),(207,508.234),(208,2841.087),(209,867.842),(210,5019.832),(211,4304.109),(212,6450.49),(213,5164.024),(214,3878.333),(215,25444.724),(216,53798.659),(217,1106.921),(218,0.063),(219,34.075),(220,209.411),(221,819.492),(222,3671.671),(223,39641.46),(225,931.016),(226,9989.592),(227,0.72),(228,214547.623),(229,40611.378),(230,31407.79),(231,282001.902),(233,11983.751),(234,22811.776),(235,14170.033),(236,29113.543),(237,46442.651),(238,53748.554),(239,7.418),(240,18.168),(243,3.221),(244,68.417),(248,10331.106),(249,5081.075),(250,2735.97),(251,4015.311),(255,5942.32),(256,450.058),(272,4702.146),(273,293.87),(299,275.416),(351,526288.942)]';
        layer.joindata = '[' +
            '{"1":"1290.667"},' +
            '{"2":"8179.959"},' +
            '{"3":"2325.163"},' +
            '{"4":"7432.631"},' +
            '{"5":"0.819"},' +
            '{"7":"5188.298"},' +
            '{"8":"36.239"},' +
            '{"9":"101276.026"},{"10":"95528.009"},{"11":"5857.891"},{"12":"17.062"},{"13":"46.616"},{"14":"65.789"},{"15":"7166.042"},{"16":"58302.945"},{"17":"2.578"},{"18":"474.149"},{"19":"15937.864"},{"20":"3217.645"},{"21":"336353.69"},{"22":"1.9180000000000001"},{"23":"140.821"},{"25":"33.435"},{"26":"49.548"},{"27":"4465.658"},{"28":"42317.386"},{"29":"865.749"},{"32":"8066.075"},{"33":"36532.525"},{"35":"94.377"},{"36":"3.305"},{"37":"4387.376"},{"38":"4916.412"},{"39":"9416.854"},{"40":"10234.164"},{"41":"522364.021"},{"44":"50415.848"},{"45":"187.862"}]';
//            ',{"46,264.894"},{"47,2.7199999999999998"},{"48,3262.985"},{"49,9868.325"},{"50,334.26"},{"51,8337.017"},{"52,5320.167"},{"53,2381.933"},{"54,7087.516"},{"55,34.996"},{"56,5580.476"},{"57,11760.21"},{"58,11883.854"},{"59,22683.655"},{"60,2625.779"},{"61,16.732"},{"62,28727.468"},{"63,899.804"},{"64,20.757"},{"65,140.845"},{"66,793.663"},{"67,3694.165"},{"68,60659.5"},{"69,65.143"},{"70,24.887"},{"72,565.479"},{"73,2662.904"},{"74,140.385"},{"75,662.054"},{"79,46866.893"},{"80,1400.309"},{"81,3224.471"},{"83,1.858"},{"84,7239.469"},{"85,4.456"},{"86,12.676"},{"87,144.34"},{"88,1.389"},{"89,5469.25"},{"90,5579.662"},{"91,1101.739"},{"93,3141.915"},{"95,4491.726"},{"96,19.865"},{"97,5271.123"},{"98,2190.133"},{"99,380.688"},{"100,508261.089"},{"101,94877.394"},{"102,37521.892"},{"103,5816.421"},{"104,15952.075"},{"105,1155.018"},{"106,26977.114"},{"107,2822.185"},{"108,14403.894"},{"109,805.538"},{"110,20175.566"},{"112,861.339"},{"113,2853.415"},{"114,22929.481"},{"115,12337.724"},{"116,5242.938"},{"117,11853.839"},{"118,327.416"},{"119,1426.341"},{"120,4957.428"},{"121,534.613"},{"122,1226.291"},{"123,228.081"},{"124,2067.829"},{"125,13.914"},{"126,2698.239"},{"128,26.723"},{"129,17102.101"},{"130,1978.131"},{"131,7610.817"},{"132,0.178"},{"133,12466.539"},{"134,63.171"},{"135,76.041"},{"136,5553.445"},{"137,150.034"},{"138,70337.973"},{"141,9860.98"},{"142,19.484"},{"143,10519.213"},{"144,2847.059"},{"145,29.856"},{"146,1747.631"},{"147,3598.287"},{"148,0.142"},{"149,15853.75"},{"150,13017.411"},{"151,6.459"},{"153,220.124"},{"154,1060.004"},{"155,300.128"},{"156,34867.964"},{"157,5921.616"},{"158,12622.234"},{"159,39389.157"},{"160,0.404"},{"162,3351.416"},{"164,17.645"},{"165,92287.043"},{"166,2779.095"},{"167,5338.87"},{"168,315.611"},{"169,17110.641"},{"170,18774.485"},{"171,40853.49"},{"173,22728.946"},{"174,5246.627"},{"175,885.537"},{"176,470.397"},{"177,776.656"},{"178,3148.19"},{"179,191.667"},{"181,7846.047"},{"182,142.204"},{"183,13196.057"},{"184,1449.317"},{"185,83040.03"},{"186,4904.201"},{"187,1.442"},{"188,15.373"},{"189,42.028"},{"190,0.148"},{"191,18.834"},{"192,1.13"},{"193,8.999"},{"194,5105.592"},{"195,5677.828"},{"196,7.443"},{"197,1279.513"},{"198,1199.936"},{"199,2266.243"},{"200,49.149"},{"201,17793.969"},{"202,25928.401"},{"203,28372.677"},{"205,141.375"},{"206,62955.36"},{"207,508.234"},{"208,2841.087"},{"209,867.842"},{"210,5019.832"},{"211,4304.109"},{"212,6450.49"},{"213,5164.024"},{"214,3878.333"},{"215,25444.724"},{"216,53798.659"},{"217,1106.921"},{"218,0.063"},{"219,34.075"},{"220,209.411"},{"221,819.492"},{"222,3671.671"},{"223,39641.46"},{"225,931.016"},{"226,9989.592"},{"227,0.72"},{"228,214547.623"},{"229,40611.378"},{"230,31407.79"},{"231,282001.902"},{"233,11983.751"},{"234":"22811.776"},{"235":"14170.033"},{"236":"29113.543"},{"237":"46442.651"},{"238":"53748.554"},{"239":"7.418"},{"240":"18.168"},{"243":"3.221"},{"244":"68.417"},{"248":"10331.106"},{"249":"5081.075"},{"250":"2735.97"},{"251":"4015.311"},{"255":"5942.32"},{"256":"1450.058"},{"272":"4702.146"},{"273":"293.87"},{"299":"275.416"},{"351":"526288.942)]';
        layer.layertitle = 'FAOSTAT Cassava Production - 2001'
        layer.layers = 'gaul0_faostat_3857';
        layer.classification= 'equalarea';
        layer.joinboundary= 'FAOSTAT';
        layer.colorramp='Blues';
        layer.intervals='8';
        layer.decimalnumbers='0';
        layer.mu='Tonnes';
        layer.lang='e';
        layer.jointype='shaded';
        layer.layertype = 'JOIN';
        layer.srs = 'EPSG:3857';
        layer.defaultgfi = true;
        //layer.openlegend = true;
        layer.measurementunit = 'Tonnes';
        layer.hidden=true;
        layer.legendtitle='Tonnes'
        layer.legendsubtitle='2001'
        var l = new FM.layer(layer);
        m.addShadedLayer(l);

        //m.zoomTo('FAOSTAT', '2', 'EPSG:3827')

        var raster = {};
        raster.layername = 'fenix:cassava_density'
        raster.layertitle = 'Cassava Density'
        raster.style = ''
        raster.urlWMS = 'http://fenix.fao.org:8050/geoserver/wms'
        raster.srs = 'EPSG:3857';
        var rasterLayer = new FM.layer(raster);
        m.addLayerWMS(rasterLayer);


        var boundaries = {};
        boundaries.layername = 'gaul0_line_3857'
        boundaries.layertitle = 'Country Boundaries'
        boundaries.style = ''
        boundaries.urlWMS = 'http://fenix.fao.org/geo'
        boundaries.srs = 'EPSG:3857';
        boundaries.opacity='0.7';
        var lboundaries = new FM.layer(boundaries);
        m.addLayerWMS(lboundaries);



        var boundaries = {};
        boundaries.layername = 'gaul0_line_3857'
        boundaries.layertitle = 'Country Boundaries'
        boundaries.style = ''
        boundaries.urlWMS = 'http://fenix.fao.org/geo'
        boundaries.srs = 'EPSG:3857';
        boundaries.opacity='0.7';
        var lboundaries = new FM.layer(boundaries);
        m.addLayerWMS(lboundaries);

       // m.addGeoJSON();

        return m;
    },


    createNigeriaMap: function(id) {

        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }

        var mapOptions = {
            zoomControl:false,
            attributionControl: false
        };


        // $("#content").append("<div style='  overflow: hidden; margin: 0 auto; text-align: left; width:800px; height: 400px;' id='map1'><div>");
        var m = new FM.Map(id, options, mapOptions);
        m.createMap();

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST_NASA_AERIAL','EN' );
        m.addTileLayer(tile, true);

        // NIGERIA - IPC LAYER
        var layer = {};
        layer.layername = 'nga_ipc'
        layer.layertitle = 'IPC - Nigeria Acute Food Insecurity Phase'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.7';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // NIGERIA - MODIS NDVI 2013/10/15
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20130913'
        layer.layertitle = 'Nigeria MODIS NDVI - 09/13/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // NIGERIA - MODIS NDVI 09/29/2013
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20130929'
        layer.layertitle = 'Nigeria MODIS NDVI - 09/29/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // NIGERIA - MODIS NDVI 09/29/2013
        var layer = {};
        layer.layername = 'nga_modis_ndvi_20131015'
        layer.layertitle = 'Nigeria MODIS NDVI - 09/29/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // NIGERIA - MODIS NDVI 10/31/2013'
        var layer = {};
        layer.layername = 'fenix:nga_modis_ndvi_20131031'
        layer.layertitle = 'Nigeria MODIS NDVI - 10/31/2013'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        // NIGERIA - DEM
        var layer = {};
        layer.layername = 'nga_dem_90'
        layer.layertitle = 'Nigeria - DEM'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.enabled = false;
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);


        // NIGERIA GAUL1
        var layer = {};
        layer.layername = 'gaul1_nga'
        layer.layertitle = 'Nigeria Administrative Boundaries Lvl1'
        layer.style = ''
        layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
        layer.srs = 'EPSG:3857';
        layer.opacity='1';
        layer.zoomTo = {
            boundary: 'GAUL0',
            code: '182',
            srs: 'EPSG:3827'
        }
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        // Country Boundaries
        var layer = {};
        layer.layername = 'gaul0_line_3857'
        layer.layertitle = 'Country Boundaries'
        layer.style = ''
        layer.urlWMS = 'http://fenix.fao.org/geo'
        layer.srs = 'EPSG:3857';
        layer.opacity='0.7';
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        return m;
    },

    createMap2:function() {

        $("#content").append("<div style='clear: both;'><div>");

        $("#content").append("<div style='overflow: hidden; margin: 0 auto; text-align: left; width:800px; height: 400px;' id='map2'><div>");
        //var options = {  geocoder: true }

        var options = {
            disclaimerfao: true,
            geosearch : true,
            mouseposition: false,
            layercontroller: true,
            zoomControl: 'bottomright'
        }

        var m2 = new FM.Map('map2', options, { zoomControl:false, attributionControl: false, crs: L.CRS.EPSG4326})


        //var options = {  geocoder: true,  layercontroller: true, zoomControl: 'bottomright' }
        //var m2 = new FM.Map('map2', options)

        m2.createMap();

 /*       var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN');
        m2.addTileLayer(tile, true);

        var tile = this.createBaseLayer('OSM','EN');
        m2.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDSTREETMAP','EN');
        m2.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST_NASA_AERIAL','EN');
        m2.addTileLayer(tile, true);

        var layer25 = {};
        layer25.data = '[(1,1290.667),{"2,8179.959),(3,2325.163),(4,7432.631),(5,0.819),(7,5188.298),(8,36.239),(9,101276.026),(10,95528.009),(11,5857.891),(12,17.062),(13,46.616),(14,65.789),(15,7166.042),(16,58302.945),(17,2.578),(18,474.149),(19,15937.864),(20,3217.645),(21,336353.69),(22,1.9180000000000001),(23,140.821),(25,33.435),(26,49.548),(27,4465.658),(28,42317.386),(29,865.749),(32,8066.075),(33,36532.525),(35,94.377),(36,3.305),(37,4387.376),(38,4916.412),(39,9416.854),(40,10234.164),(41,522364.021),(44,50415.848),(45,187.862),(46,264.894),(47,2.7199999999999998),(48,3262.985),(49,9868.325),(50,334.26),(51,8337.017),(52,5320.167),(53,2381.933),(54,7087.516),(55,34.996),(56,5580.476),(57,11760.21),(58,11883.854),(59,22683.655),(60,2625.779),(61,16.732),(62,28727.468),(63,899.804),(64,20.757),(65,140.845),(66,793.663),(67,3694.165),(68,60659.5),(69,65.143),(70,24.887),(72,565.479),(73,2662.904),(74,140.385),(75,662.054),(79,46866.893),(80,1400.309),(81,3224.471),(83,1.858),(84,7239.469),(85,4.456),(86,12.676),(87,144.34),(88,1.389),(89,5469.25),(90,5579.662),(91,1101.739),(93,3141.915),(95,4491.726),(96,19.865),(97,5271.123),(98,2190.133),(99,380.688),(100,508261.089),(101,94877.394),(102,37521.892),(103,5816.421),(104,15952.075),(105,1155.018),(106,26977.114),(107,2822.185),(108,14403.894),(109,805.538),(110,20175.566),(112,861.339),(113,2853.415),(114,22929.481),(115,12337.724),(116,5242.938),(117,11853.839),(118,327.416),(119,1426.341),(120,4957.428),(121,534.613),(122,1226.291),(123,228.081),(124,2067.829),(125,13.914),(126,2698.239),(128,26.723),(129,17102.101),(130,1978.131),(131,7610.817),(132,0.178),(133,12466.539),(134,63.171),(135,76.041),(136,5553.445),(137,150.034),(138,70337.973),(141,9860.98),(142,19.484),(143,10519.213),(144,2847.059),(145,29.856),(146,1747.631),(147,3598.287),(148,0.142),(149,15853.75),(150,13017.411),(151,6.459),(153,220.124),(154,1060.004),(155,300.128),(156,34867.964),(157,5921.616),(158,12622.234),(159,39389.157),(160,0.404),(162,3351.416),(164,17.645),(165,92287.043),(166,2779.095),(167,5338.87),(168,315.611),(169,17110.641),(170,18774.485),(171,40853.49),(173,22728.946),(174,5246.627),(175,885.537),(176,470.397),(177,776.656),(178,3148.19),(179,191.667),(181,7846.047),(182,142.204),(183,13196.057),(184,1449.317),(185,83040.03),(186,4904.201),(187,1.442),(188,15.373),(189,42.028),(190,0.148),(191,18.834),(192,1.13),(193,8.999),(194,5105.592),(195,5677.828),(196,7.443),(197,1279.513),(198,1199.936),(199,2266.243),(200,49.149),(201,17793.969),(202,25928.401),(203,28372.677),(205,141.375),(206,62955.36),(207,508.234),(208,2841.087),(209,867.842),(210,5019.832),(211,4304.109),(212,6450.49),(213,5164.024),(214,3878.333),(215,25444.724),(216,53798.659),(217,1106.921),(218,0.063),(219,34.075),(220,209.411),(221,819.492),(222,3671.671),(223,39641.46),(225,931.016),(226,9989.592),(227,0.72),(228,214547.623),(229,40611.378),(230,31407.79),(231,282001.902),(233,11983.751),(234,22811.776),(235,14170.033),(236,29113.543),(237,46442.651),(238,53748.554),(239,7.418),(240,18.168),(243,3.221),(244,68.417),(248,10331.106),(249,5081.075),(250,2735.97),(251,4015.311),(255,5942.32),(256,450.058),(272,4702.146),(273,293.87),(299,275.416),(351,526288.942)]';
        // layer2.layername = 'gaul1_3857'
        layer25.layername = 'gaul0_line'
        layer25.layertitle = 'gaul0 Line MAPPA 2'
        layer25.style = ''
        layer25.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        layer25.srs = 'EPSG:3857';
        var l25 = new FM.layer(layer25);
        m2.addLayerWMS(l25);


        var join2 = {};
        join2.joindata = '[(1,1290.667),(2,8179.959),(3,2325.163),(4,7432.631),(5,0.819),(7,5188.298),(8,36.239),(9,101276.026),(10,95528.009),(11,5857.891),(12,17.062),(13,46.616),(14,65.789),(15,7166.042),(16,58302.945),(17,2.578),(18,474.149),(19,15937.864),(20,3217.645),(21,336353.69),(22,1.9180000000000001),(23,140.821),(25,33.435),(26,49.548),(27,4465.658),(28,42317.386),(29,865.749),(32,8066.075),(33,36532.525),(35,94.377),(36,3.305),(37,4387.376),(38,4916.412),(39,9416.854),(40,10234.164),(41,522364.021),(44,50415.848),(45,187.862),(46,264.894),(47,2.7199999999999998),(48,3262.985),(49,9868.325),(50,334.26),(51,8337.017),(52,5320.167),(53,2381.933),(54,7087.516),(55,34.996),(56,5580.476),(57,11760.21),(58,11883.854),(59,22683.655),(60,2625.779),(61,16.732),(62,28727.468),(63,899.804),(64,20.757),(65,140.845),(66,793.663),(67,3694.165),(68,60659.5),(69,65.143),(70,24.887),(72,565.479),(73,2662.904),(74,140.385),(75,662.054),(79,46866.893),(80,1400.309),(81,3224.471),(83,1.858),(84,7239.469),(85,4.456),(86,12.676),(87,144.34),(88,1.389),(89,5469.25),(90,5579.662),(91,1101.739),(93,3141.915),(95,4491.726),(96,19.865),(97,5271.123),(98,2190.133),(99,380.688),(100,508261.089),(101,94877.394),(102,37521.892),(103,5816.421),(104,15952.075),(105,1155.018),(106,26977.114),(107,2822.185),(108,14403.894),(109,805.538),(110,20175.566),(112,861.339),(113,2853.415),(114,22929.481),(115,12337.724),(116,5242.938),(117,11853.839),(118,327.416),(119,1426.341),(120,4957.428),(121,534.613),(122,1226.291),(123,228.081),(124,2067.829),(125,13.914),(126,2698.239),(128,26.723),(129,17102.101),(130,1978.131),(131,7610.817),(132,0.178),(133,12466.539),(134,63.171),(135,76.041),(136,5553.445),(137,150.034),(138,70337.973),(141,9860.98),(142,19.484),(143,10519.213),(144,2847.059),(145,29.856),(146,1747.631),(147,3598.287),(148,0.142),(149,15853.75),(150,13017.411),(151,6.459),(153,220.124),(154,1060.004),(155,300.128),(156,34867.964),(157,5921.616),(158,12622.234),(159,39389.157),(160,0.404),(162,3351.416),(164,17.645),(165,92287.043),(166,2779.095),(167,5338.87),(168,315.611),(169,17110.641),(170,18774.485),(171,40853.49),(173,22728.946),(174,5246.627),(175,885.537),(176,470.397),(177,776.656),(178,3148.19),(179,191.667),(181,7846.047),(182,142.204),(183,13196.057),(184,1449.317),(185,83040.03),(186,4904.201),(187,1.442),(188,15.373),(189,42.028),(190,0.148),(191,18.834),(192,1.13),(193,8.999),(194,5105.592),(195,5677.828),(196,7.443),(197,1279.513),(198,1199.936),(199,2266.243),(200,49.149),(201,17793.969),(202,25928.401),(203,28372.677),(205,141.375),(206,62955.36),(207,508.234),(208,2841.087),(209,867.842),(210,5019.832),(211,4304.109),(212,6450.49),(213,5164.024),(214,3878.333),(215,25444.724),(216,53798.659),(217,1106.921),(218,0.063),(219,34.075),(220,209.411),(221,819.492),(222,3671.671),(223,39641.46),(225,931.016),(226,9989.592),(227,0.72),(228,214547.623),(229,40611.378),(230,31407.79),(231,282001.902),(233,11983.751),(234,22811.776),(235,14170.033),(236,29113.543),(237,46442.651),(238,53748.554),(239,7.418),(240,18.168),(243,3.221),(244,68.417),(248,10331.106),(249,5081.075),(250,2735.97),(251,4015.311),(255,5942.32),(256,450.058),(272,4702.146),(273,293.87),(299,275.416),(351,526288.942)]';
        join2.layertitle = 'JOINED LAYER 2 equalinterval'
        join2.layers = 'gaul0_faostat_3857';
        //join2.classification= 'equalinterval';
        join2.classification= 'equalarea';
        join2.joinboundary= 'FAOSTAT';
        join2.colorramp='Blues';
        join2.intervals='8';
        join2.decimalnumbers='0';
        join2.lang='e';
        join2.jointype='shaded';
        join2.layertype = 'JOIN';
        join2.srs = 'EPSG:3857';
        var l2 = new FM.layer(join2);
        m2.addShadedLayer(l2);*/


        var boundaries = {};
        boundaries.layername = 'gaul0_faostat'
        boundaries.layertitle = 'gaul0_faostat erterterteroiertjoiertjeirotjoiertoijert'
        //boundaries.style = ''
        boundaries.style = ''
        boundaries.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        boundaries.srs = 'EPSG:4326';
        boundaries.opacity='0.7';
        var lboundaries = new FM.layer(boundaries);
        m2.addLayerWMS(lboundaries);

       // FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://mapserver2.provincia.ms.it/arcgis/services/vettorialiweb/mapserver/wmsserver');
//       FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://www.idee.es/wms/PNOA/PNOA');
//        FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi');
//        FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://geoportal.logcluster.org:8081/gp_map_service201/wms');
//        FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi');
        //FM.WMSUtils.WMSCapabilities('wmsDirectoryLayer' , m2, 'http://wms.jpl.nasa.gov/wms.cgi');
/*
        FM.WMSUtils.WFSCapabilities('wmsDirectoryLayer' , m2, 'http://www2.dmsolutions.ca/cgi-bin/mswfs_gmap');
        FM.WMSUtils.WFSCapabilities('wmsDirectoryLayer' , m2, 'http://giswebservices.massgis.state.ma.us/geoserver/wfs');
*/

//        http://giswebservices.massgis.state.ma.us/geoserver/wfs?request=GetCapabilities&service=WFS&version=1.0.0

        m2.addGeoJSON();

        return m2;
    },


    createCountrySTATLandingPage:function () {

        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }


        var m = new FM.Map('map1', options, { zoomControl:false, attributionControl: false });
        m.createMap();

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);



        // COUNTRYSTAT LAYER
        var layer = {};
        layer.layername = 'gaul0_3857'
        layer.layertitle = 'Country+boundaries'
        layer.style='gaul_green'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.lang='e';
        layer.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        console.log(layer);


        var layer = {};
        layer.layername = 'gaul1_3857'
        layer.layertitle = ',Administrative+level+1'
        layer.style='gaul1_line_green'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.lang='e';
        layer.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
/*        layer.bbox = {
            "xmin" : -8.56,
            "xmax" : -2.49,
            "ymax" : 10.73,
            "ymin" : 4.35
        }*/

        layer.bbox = {
            "ymin" : 35.2889595031738,
            "ymax" : 47.0921478271484,
            "xmin" : 6.62726545333862,
            "xmax" : 18.7844753265381
        }

      //  "35.2889595031738","47.0921478271484","6.62726545333862","18.7844753265381"
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        //m.zoomTo('GAUL0', '66', 'EPSG:3827')

        FM.LayerUtils.zoomToLayer(m.map, layer)

        return m;
    },


    createCOUNTRYSTATJOIN: function() {

        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }


        var m = new FM.Map('map1', options, { zoomControl:false, attributionControl: false });
        m.createMap();

        m.addTileLayer(this.createBaseLayer('OSM','EN' ), true);
        m.addTileLayer(this.createBaseLayer('MAPQUEST', 'EN' ), true);
        m.addTileLayer(this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' ), true);

        var layer = {};
        layer.layers='gaul1_3857'
        layer.styles=''
        layer.layertitle="Cote D'ivore production "
        layer.joincolumn='adm1_code'
        layer.joindata='[(40695,6205),(40694,30507),(1043,3793),(1044,5832),(1045,4255),(40692,2418),(40693,6522),(1046,2013),(1047,5194),(1048,139475),(1049,6369),(1050,2955),(1051,9891),(40697,14411),(1053,7541)]'
        layer.colorramp='Reds'
        layer.intervals='4'
        layer.addborders='true'
        layer.borderscolor='FFFFFF'
        layer.bordersstroke='1.0'
        layer.bordersopacity='0.5'
        layer.legendtitle='Superficie rcolte (ha)'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.layertype = 'JOIN';
        layer.defaultgfi = true;
        layer.lang='EN';
        layer.jointype='shaded';
        layer.swipeenable = true;
        layer.switchjointype = false;
        var l = new FM.layer(layer);
        m.addShadedLayer(l);

        m.zoomTo('FAOSTAT', '107')
    },

    createBaseLayer: function (layername, lang) {
        var layer = {};
        layer.layername =layername;
        layer.layertype ='TILE';
        layer.lang = lang;
        var l = new FM.TileLayer(layer);
        l.leafletLayer = l.createTileLayer(layer.layername);
        return l;
    },


    ESSWebsite: function() {

        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }


        $("#content").append("<div style='  overflow: hidden; margin: 0 auto; text-align: left; width:800px; height: 400px;' id='map3'><div>");
        var m = new FM.Map('map3', options, { zoomControl:false, attributionControl: false });
        m.createMap();

        var tile = this.createBaseLayer('OSM','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('MAPQUEST','EN' );
        m.addTileLayer(tile, true);

        var tile = this.createBaseLayer('ESRI_WORLDTERRAINBASE','EN' );
        m.addTileLayer(tile, true);



        // COUNTRYSTAT LAYER
        var layer = {};
        layer.layername = 'gaul0_3857'
        layer.layertitle = 'Country+boundaries'
        layer.style='gaul_green'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.lang='e';
        layer.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        console.log(layer);


        var layer = {};
        layer.layername = 'gaul1_3857'
        layer.layertitle = ',Administrative+level+1'
        layer.style='gaul1_line_green'
        layer.cql_filter="adm0_code IN (66)";
        layer.srs = 'EPSG:3857';
        layer.lang='e';
        layer.urlWMS = 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms'
        /*        layer.bbox = {
         "xmin" : -8.56,
         "xmax" : -2.49,
         "ymax" : 10.73,
         "ymin" : 4.35
         }*/

        //layer.bbox = ["2.00000023841858","2.00000047683716","15.9999990463257","16"]; // africa
        layer.bbox = ["70.44","34","29","40"] //europe

        //  "35.2889595031738","47.0921478271484","6.62726545333862","18.7844753265381"
        var l = new FM.layer(layer);
        m.addLayerWMS(l);

        //m.zoomTo('GAUL0', '66', 'EPSG:3827')

        FM.LayerUtils.zoomToLayer(m.map, layer)

        return m;

    },

    wmsCapabalities: function() {
       FM.WMSUtils.WMSCapabilities('http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/wms');
    }


};