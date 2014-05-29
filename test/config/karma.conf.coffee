
module.exports = (config) ->
    config.set
        basePath: '../../'
        browsers: ['Chrome']
        frameworks: ['jasmine']
        preprocessors:
            '**/*.coffee': ['coffee']

        coffeePreprocessor:
            options:
                bare: true
