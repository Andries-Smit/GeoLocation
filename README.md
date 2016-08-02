# GPS Tracking

This widget impelements GPS background tracking in your Mendix Phonegap application! 

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Localizing employees and providing them with real-time information on their environment or sending push messages to employees in a certain area, based on logic.

## Description

Put this widget inside a context, set the attributes with the desired values and track the devices!

## Phonegap configuration

If you use this widget, note that you need to edit phonegap config.xml with the following additions:

* Add the background geolocation plugin to the plugin list. Add this: ```<gap:plugin name="cordova-plugin-mauron85-background-geolocation" source="npm" version="2.1.2"/>```

After having done this, be sure to rebuild your phonegap package.

## Widget Configuration & Properties

The widget needs an entity as it's context. All attributes need to be set in order for the widget to work. For more information on configuration options see [The plugin documentation](https://github.com/mauron85/cordova-plugin-background-geolocation). Be sure to implement the following configuration settings as well to prevent errors.

Create a new object in your domain model. It may be non persistant and it may be user specific. Make sure it has the following attributes:

* url (String) - url to post the Location information to on successful callback
* debug (Boolean) - set to true to enable live debug information on the device
* desiredAccuracy (Integer) - desired accuracy in meters
* interval (Integer) - minimum time interval between updates in miliseconds
* fastestInterval (Integer) - fastest rate in miliseconds at which your app can handle location updates.

On the Behavior tab select the attributes. On the Notification tab you can specify the notification title and message. This notification must be shown, in order to prioritize the background tracking.

## Implementation example

Include the REST Services module in your application and publish a Microflow Service with one parameter with the following attributes:



## Known issues and bugs

None. Please let us know if you run into any!
