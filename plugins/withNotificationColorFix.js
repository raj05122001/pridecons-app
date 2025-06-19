const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationColorFix(config) {
  return withAndroidManifest(config, async (cfg) => {
    const app = cfg.modResults.manifest.application[0];

    // पुरानी duplicate meta-data हटायें
    app['meta-data'] = (app['meta-data'] || []).filter(
      (m) => m['$']['android:name'] !== 'com.google.firebase.messaging.default_notification_color'
    );

    // अपनी meta-data दोबारा डालें
    app['meta-data'].push({
      $: {
        'android:name': 'com.google.firebase.messaging.default_notification_color',
        'android:resource': '@color/notification_icon_color',
        'tools:replace': 'android:resource',
      },
    });

    // tools namespace पक्का करें
    cfg.modResults.manifest.$['xmlns:tools'] =
      'http://schemas.android.com/tools';
    return cfg;
  });
};
