/**
 * @return { import("@amadeus-it-group/kassette").ConfigurationSpec }
 */
 exports.getConfiguration = () => {
    return {
      port: 4400,
      mocksFolder: './mocks-folder',
      mode: 'local',
    };
};