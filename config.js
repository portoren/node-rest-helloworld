/**
 * Create and export configuration variables
 */

// Container for all the environments
var environments = {};

// Staging (defult) environment
environments.staging = {
    'httpPort' : 4000,
    'envName' : 'staging'
};

// Production environment
environments.production = {
    'httpPort' : 6000,
    'envName' : 'production'
};

// determinar cual es el environment que se ha indicado por la linea de comandos
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// verifica que el environment actual sea uno de los definidos, si no toma el por defecto
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// exporta el modulo
module.exports = environmentToExport;
