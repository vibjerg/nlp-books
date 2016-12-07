'use strict';

import * as BaseSoapClient from 'dbc-node-basesoap-client';

/**
 * Constructs the object of parameters for search result request.
 *
 * @param {Object} value Object with parameters for getting a search result
 * @return {Promise}
 */
function getFacetResult(client, values) {
  const params = {
    query: values.query,
    stepValue: 0,
    start: 1,
    facets: values.facets
  };

  return client.request('search', params, null, true);
}

/**
 * Constructs the object of parameters for search result request.
 *
 * @param {Object} value Object with parameters for getting a search result
 * @return {Promise}
 */
function getSearchResult(client, values) {
  const params = {
    query: values.query,
    stepValue: values.stepValue || 10,
    start: values.start | 0,
    sort: values.sort,
    objectFormat: 'dkabm',
    facets: values.facets || {}
  };

  return client.request('search', params, null, true);
}

/**
 * Constructs the object of parameters for work request.
 *
 * @param {Object} value Object with parameters for getting a work
 * @return {Promise}
 */
function getWorkResult(client, values) {
  let opts = {};
  if (values.agency) {
    opts.agency = values.agency;
  }

  const params = {
    query: values.query,
    start: 1,
    stepValue: 1,
    allObjects: true,
    objectFormat: values.objectFormats || ['dkabm', 'briefDisplay'],
    relationData: values.getRelationData || 'full'
  };

  return client.request('search', params, opts, true);
}

/**
 * Setting the necessary paramerters for the client to be usable.
 * The wsdl is only set if wsdl is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
export default function OpenSearch (config) {


  const defaults = {
    agency: '190101',
    profile: 'default'
  };

  const logger = console;

  const opensearchClient = BaseSoapClient.client('http://opensearch.addi.dk/b3.0_4.3/?wsdl', defaults, logger);

  return {
    getFacetResult: getFacetResult.bind(null, opensearchClient),
    getSearchResult: getSearchResult.bind(null, opensearchClient),
    getWorkResult: getWorkResult.bind(null, opensearchClient)
  };
}