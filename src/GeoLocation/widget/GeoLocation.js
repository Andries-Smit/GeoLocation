/*global logger*/
/*
    GeoLocation
    ========================

    @file      : GeoLocation.js
    @version   : 1.0.0
    @author    : Willem van Zantvoort
    @date      : 2016-07-18
    @copyright : TimeSeries Group 2016
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "GeoLocation/lib/jquery-1.11.2",
    "dojo/text!GeoLocation/widget/template/GeoLocation.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("GeoLocation.widget.GeoLocation", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        start: true,
        url: "",


        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            // document.addEventListener('deviceready', this._onDeviceReady, false);   
                  
        },

        callbackFn: function(location) {
            logger.debug(this.id +".callbackFn");
            location.uniqueId = device.uuid;
            logger.debug(this.id + device.uuid);
     
            // Do your HTTP request here to POST location to your server. 
            //jQuery.post(url, JSON.stringify(location), "json"); 
            $.ajax({
                url:this.url,
                type:"POST",
                data:JSON.stringify(location),
                contentType:"application/json; charset=utf-8",
                dataType:"json"
            });

     
            /*
            IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            */
            backgroundGeolocation.finish();
        },

        failureFn: function(error) {
            logger.debug('BackgroundGeolocation error');
            logger.debug(error);
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

         
            // If you wish to turn OFF background-tracking, call the #stop method. 
            // backgroundGeolocation.stop(); 
            this._updateRendering();
        },

        showDeviceID: function() {
            alert("Your device ID: " + device.uuid);
        },

        _startStop: function() {
            if (this.start) {
                logger.debug("stopping service");
                backgroundGeolocation.stop();
                this.start = false;
            } else {
                logger.debug("starting service");
                backgroundGeolocation.start();
                this.start = true;
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this.url = obj.get(this.url);

            logger.debug(obj.get(this.desiredAccuracy), this.notificationTitle, this.notificationText, obj.get(this.debug), obj.get(this.interval), obj.get(this.fastestInterval));
         
            // BackgroundGeolocation is highly configurable. See platform specific configuration options 
            backgroundGeolocation.configure(
                lang.hitch(this, function(location) {
                    logger.debug(location);
                    this.callbackFn(location);}), 
                lang.hitch(this, function(error) {
                    logger.debug(error)
                    this.failureFn(error)}), {
                        desiredAccuracy: obj.get(this.desiredAccuracy),
                        // notificationIconColor: this.notificationIconColor,
                        notificationTitle: this.notificationTitle,
                        notificationText: this.notificationText,
                        debug: obj.get(this.debug), // <-- enable this hear sounds for background-geolocation life-cycle.
                        stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
                        locationProvider: backgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
                        interval: obj.get(this.interval), // <!-- poll for position every minute
                        fastestInterval: obj.get(this.fastestInterval),
                }
            );
         
            // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
            backgroundGeolocation.start();
            this.start = true;

            this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        },

        // Rerender the interface.
        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            // The callback, coming from update, needs to be executed, to let the page know it finished rendering
            mendix.lang.nullExec(callback);
        },
    });
});

require(["GeoLocation/widget/GeoLocation"]);
