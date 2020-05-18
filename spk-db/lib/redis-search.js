const
  _                   = require('lodash'),                                // Lodash is used for parsing redis output
  rediSearchBindings  = require('redis-redisearch'),  
  { promisify }       = require('util'),                    // supplies node_redis with the extended RediSearch commands
  s                   = {                                                 // Static strings are declared here to prevent retyping and typos
    // RediSearch strings
    noContent   : 'NOCONTENT',
    noOffsets   : 'NOOFFSETS',
    noFields    : 'NOFIELDS',
    noFreqs     : 'NOFREQS',
    noStem      : 'NOSTEM',
    noSave      : 'NOSAVE',
    stopwords   : 'STOPWORDS',
    schema      : 'SCHEMA',
    text        : 'TEXT',
    numeric     : 'NUMERIC',
    geo         : 'GEO',
    weight      : 'WEIGHT',
    sortable    : 'SORTABLE',
    fields      : 'FIELDS',
    language    : 'LANGUAGE',
    payload     : 'PAYLOAD',
    replace     : 'REPLACE',
    limit       : 'LIMIT',
    tag         : 'TAG',
    tagSep      : 'SEPARATOR',

    // node_redis strings
    multiConstructor
                : 'Multi'
  },
  defaultNumberOfResults                                                  // While 10 is the default in RediSearch, we'll always send it for code consistency
                      = 10,
  noop                = function() {};                                    // When nothing is needed.

function optionalOptsCbHandler(passedPenultimateArg,passedUltimateArg) {  // Most functions end with (...[options],[cb]) this handles both optional arguments
  let out = {                                                             // defualt, mutate as needed
    opts    : {},
    cb      : noop
  };

  if (typeof passedPenultimateArg === 'function') {                       // passed a function in penultimate argument then there is no opts
    out.cb = passedPenultimateArg;
  } else if (typeof passedUltimateArg === 'function') {                   // If the final argument is a function then we know there is a options object in the penultimate
    out.opts = passedPenultimateArg;
    out.cb = passedUltimateArg;
  } else if (passedPenultimateArg) {                                      // If neither the penulitimate or ultimate argument is a function then we know the penultimate is options
    out.opts = passedPenultimateArg;
  }

  return out;                                                             // feed it back the (possibly) mutated `out` object
}

module.exports = function(clientOrNodeRedis,key,passedOptsOrCb,passedCb) {// This pattern allows for multiple instances to be generated but also to have private variables
  let
    constructorlastArgs = optionalOptsCbHandler(passedOptsOrCb,passedCb), // the options and callback for the entire instantiation
    checked             = false,                                          // Have we checked for bindings
    client,                                                               // client is the general client being used for all operations on this index
    rediSearchObj;                                                        // We'll eventually return this and also use to do chaining correctly
  
  /* internal utility functions */
  const chainer = function(cObj) {                                        // convenience function to consistenty handling function chaining even while in multi                                         
    return cObj.constructor.name === s.multiConstructor ?                 // We look if the constructor has a name equal to 'Multi' (although any node_redis pipeline will identify this way)
      cObj : rediSearchObj;                                               // if it is a Multi, then we return that, otherwise we return the original return object of this outer fuction
  }
  const clientCheck = function() {                                        // check for the correct node_redis / RediSearch command bindings
    if (!client.ft_create) {                                              // ft.create / ft_create should tell us if we have it
      throw new Error(                                                    // otherwise exit / throw - we can't go any further.
        'Redis client instance has not enabled RediSearch.'
      ); 
    }
    checked = true;                                                       // `checked` becomes true - which is in one scope level up
  };
  const deinterleave = function(doc) {                                    // `doc` is an array like this `['fname','kyle','lname','davis']`
  return  _(doc)                                                        // Start the lodash chain with `doc`
    .chunk(2)                                                           // `chunk` to convert `doc` to `[['fname','kyle'],['lname','davis']]`
    .fromPairs()                                                        // `fromPairs` converts paired arrays into objects `{ fname : 'kyle', lname : 'davis }`
    .value();                                                           // Stop the chain and return it back
  }
  const docResultParserFactory = function(opts) {                         // `opts` is being reserved later functionality
    return function(doc) {                                                // Since `opts` will be later used, we need to close over it as it mighy be different for every call
      return {                                                            // otherwise it's just a wrapper
        doc     : deinterleave(doc)                                       // for deinterleaving
      }
    }
  };
  const searchResultParserFactory = function(opts) {                      // `opts`, at this point, is used to pass in the offset, but big plans
    return function(results) {                                            // closing over the `opts`
      let
        totalResults = results[0];                                        // first one is just the number of results as returned by RediSearch
      
      if (opts.noContent === true) {
        results = _(results.slice(1))
          .map(function(aResult) {
            return {
              docId     : aResult
            }
          })
          .value();
      } else {
        results = _(results.slice(1))                                       // all of the commands past the first one are pushed into lodash
          .chunk(2)                                                         // docIds and documents are interleaved (multi bulk)
          .map(function(aResult) {                                          // convert the array pairs into meaniful objects
            return {
              docId     : aResult[0],                                       // first element is the docId
              doc       : deinterleave(aResult[1])                          // second element is the document, but we need to deinterleave it
            };
          })
          .value();                                                         // return the plain object value over the lodash chainable
        }

      return {
        results       : results,                                          // results of the search
        totalResults  : totalResults,                                     // number of results irrespective of LIMIT clauses
        offset        : opts.offset || 0,                                 // offset, if we've got one
        resultSize    : results.length,                                   // number of results returned (sugar to for easy logic to see if we're at the end of the result set) 
        requestedResultSize    
                      : opts.numberOfResults || defaultNumberOfResults,   // How many per this result set requested
      };
    };
  };
  

  /* directly returned functions */
  const createIndex = async function(fields,passedOptsOrCb,passedCb) {          // create an index - should be called only once.
    let
      createArgs  = [],                                                   // we'll add in our Redis arguments to this variable
      lastArgs    = optionalOptsCbHandler(passedOptsOrCb,passedCb);       // handle the last two optional arguments
   
    if (!checked) { clientCheck(); }                                      // bindings check
                                                                          // push options if items are set to `true` in the options object
    if (lastArgs.opts.noOffsets) { createArgs.push(s.noOffsets); }        
    if (lastArgs.opts.noFields) { createArgs.push(s.noFields); }
    if (lastArgs.opts.noFreqs) { createArgs.push(s.noFreqs); }
    if (lastArgs.opts.noStopWords) {                                      // `noStopWords` is mutually exclusive with `stopwords`
      createArgs.push(s.stopwords, 0);
    } else if (lastArgs.opts.stopwords) {                                 // If we have `stopwords`...
      createArgs.push(s.stopwords, lastArgs.opts.stopwords.length);       // push in the prefix argument (STOPWORDS) followed by the number of stop words
      createArgs = createArgs.concat(lastArgs.opts.stopwords);            // finally add all the stop words in
    }
    createArgs.push(s.schema);                                  
    fields.forEach(function(aField) {                                     // the `fieldDefinition` methods handle the correct argument order for each field...
      createArgs = createArgs.concat(aField);                             // so we just concat them into the arguments array
    });
    await client.ft_create(key,createArgs,lastArgs.cb);     
  };
  const dropIndex = function(cb) {
    if (!checked) { clientCheck(); }
    
    client.ft_drop(key,cb);
  };

  /* function factories either returned directly with the client or used in pipelines */
  const searchFactory = function(cObj) {                                  // close over the `cObj` which can either be the general client or the pipeline instance
    return function(queryString, passedOptsOrCb, passedCb) {              // query + our optional arguments
      let 
        lastArgs = optionalOptsCbHandler(passedOptsOrCb,passedCb),        // handle the last two optional arguments
        searchArgs = [],                                                  // where all our arguments will be collected
        parser = searchResultParserFactory(lastArgs.opts);                // parse the results

      if (!checked) { clientCheck(); }                                    // bindings check
      
      searchArgs.push(queryString);

      if (lastArgs.opts.noContent) {
        searchArgs.push(
          s.noContent
        );
      }
      if (lastArgs.opts.offset || lastArgs.opts.numberOfResults) {        // if we have an offset or number of results..
        searchArgs.push(                                                  // then push in a limit clause
          s.limit,                                                        // 'LIMIT'
          lastArgs.opts.offset || 0,                                      // offset or (default) 0
          lastArgs.opts.numberOfResults || defaultNumberOfResults         // numberOfResults or the default number of results (10)
        );
      }
      if (cObj.constructor.name === s.multiConstructor) {                 // detect if we're in a pipeline
        cObj.parsers = !cObj.parsers ? {} : cObj.parsers;                 // if so, check if a `parsers` object property exists, if not create one
        cObj.parsers['c'+cObj.queue.length] = parser;                     // push the correct parser into the object at an index 'c'(current index #)
      }
      cObj.ft_search(key,searchArgs,function(err,results) {               // run the command with the `key` established on instantiation and our arguments
      if (err) { 
          lastArgs.cb(err); } else {                             // handle the errors
        
          if (lastArgs.cb !== noop) {                                     // if we have a noop in the callback then we do nothing...
            lastArgs.cb(err,parser(results));                             // otherwise we run the parser and pass it back to the callback.
          }
        }
      });

      return chainer(cObj);                                               // return the correct object for chaining.
    };
  };

  const addFactory = function(cObj) {                                     // close over the `cObj` which can either be the general client or the pipeline instance
    //cObj is either a `client` or pipeline instance
    return function(docId, values, passedOptsOrCb, passedCb) {            // `docId` + `document` (as an object) and optional arguments
      let
      lastArgs = optionalOptsCbHandler(passedOptsOrCb,passedCb),        // handle the last two optional arguments
      addArgs   = [docId];                                              // start off the arguments to pass to RediSearch

      if (!checked) { clientCheck(); }                                    // bindings check
        
      addArgs.push(lastArgs.opts.score || 1, s.fields);                   // Score, if we've got one and then FIELDS
      Object.keys(values).forEach(function(aField) {                      // Get the keys of the passed in plain object then iterate
        addArgs.push(aField,values[aField]);                              // interlace field name / value
      });
      cObj.ft_add(key,addArgs,lastArgs.cb);                               // run the command with the `key` established on instantiation and our arguments 
      return chainer(cObj);                                               // return the correct object for chaining.
    };
  };

  const getDocFactory = function(cObj) {                                  // close over the `cObj` which can either be the general client or the pipeline instance
    return function(docId, passedOptsOrCb, passedCb) {                    // `docId` and optional arguments
      let 
      document = null,
      lastArgs  = optionalOptsCbHandler(passedOptsOrCb,passedCb),       // handle the last two optional arguments
      parser    = docResultParserFactory(lastArgs.opts);                // parse the results
      
      if (!checked) { clientCheck(); }                                    // bindings check

      if (cObj.constructor.name === s.multiConstructor) {                 // detect if we're in a pipeline
        cObj.parsers = !cObj.parsers ? {} : cObj.parsers;                 // if so, check if a `parsers` object property exists, if not create one
        cObj.parsers['c'+cObj.queue.length] = parser;                     // push the correct parser into the object at an index 'c'(current index #)
      }
      cObj.ft_get(key, docId, function(err,doc){   
        if (err) { lastArgs.cb(err); } else {                             // handle the errors
          document = doc;
          if (lastArgs.cb !== noop) {                                     // if we have a noop in the callback then we do nothing..
            lastArgs.cb(err,parser(doc));                                 // otherwise we run the parser and pass it back to the callback.
        }
      }
    });
      return chainer(cObj);                                               // return the correct object for chaining.
    };
  }

  const execFactory = function(cObj) {                                    // exec a pipeline with the correct pipeline
    return function(cb) {                                                 // accept a callback (`cb`). It's required in this case otherwise it'd be a useless function
      cObj.exec(function(err,results) {                                   // execute the pipeline
        if (err) { cb(err); } else {                                      // handle the errors
          for (let i = 0; i < results.length; i += 1) {                   // iterate over the results
            if (cObj.parsers['c'+i]) {                                    // if we have a parser for this item...
              results[i] = cObj.parsers['c'+i](results[i]);               // run the parser and mutate the results
            }
          }
          cb(err,results);                                                // return back the results through a callback
        }
      });
    };
  };

  const pipelineFactory = function(fnName) {                              // create a pipeline - `fnName` is the function name - allows for future expansion to MULTI
    return function(passedPipeline) {                                     // return a function - `passedPipeline` is optional - an existing pipeline
      let 
        ctx = passedPipeline || client[fnName]();                         // if we have a passed pipeline, then use that, otherwise, create a pipeline
      
      Object.getPrototypeOf(ctx).rediSearch = {                           // monkey patch the prototype with these extra functions in the `rediSearch` object
        add     : addFactory(ctx),                                        // `rediSearch.add` - add a document
        getDoc  : getDocFactory(ctx),                                     // `rediSearch.getDoc` - get a document by ID
        search  : searchFactory(ctx),                                     // `rediSearch.search` - search for a document by a query

        exec    : execFactory(ctx)                                        // `rediSearch.exec` run the pipeline                            
      };
      return ctx;                                                         // return `ctx` for chaining
    };
  };

  /* Schema functions */
  const genericField = function(fieldType) {                              // NUMERIC and GEO fields have only the sortable option, so we can generalize
    return function(name,sortable) {                                      // the field `name` string and the `sortable` bool
      let field = [name, fieldType];                                      // create an array
      if (sortable) { field.push(s.sortable); }                           // Add SORTABLE if it is
      return field;                                                       // return the array
    };
  };
  const fieldDefinition = {                                               // object is returned directly
    text        : function(name, sortable, textOpts) {                    // TEXT fields are more complicated and have a `textOpts` object
      let field = [name, s.text];                                         // create the array and specify that it's text
      if (textOpts && textOpts.noStem) {                                  // if we've got options and noStem is specified...
        field.push(s.noStem);                                             // push it in
      }
      if (textOpts && textOpts.weight) {                                  // if we've got options and weight is specified...
        field.push(s.weight, textOpts.weight);                            // push it in
      }
      if (sortable) { field.push(s.sortable); }                           // Add SORTABLE if it is
      return field;                                                       // return the array
    },
    numeric     : genericField(s.numeric),                                // numeric fields 
    geo         : genericField(s.geo),                                    // geo fields,
    tag         : function(name, fieldOpts) {
      let field = [name, s.tag];
      if (fieldOpts && fieldOpts.separator) {
        field.push(s.tagSep,'"'+fieldOpts.separator+'"');
      }
      return field;
    }
  };

  /* setup */
  if (clientOrNodeRedis.constructor.name === 'RedisClient') {             // Is the first argument a node_redis client object or the module
    client = clientOrNodeRedis;                                           // client passed in first agrument
  } else if (typeof clientOrNodeRedis.RedisClient === 'function') {       // We'll assume if the first argument has the RedisClient method that its...
    rediSearchBindings(clientOrNodeRedis);                                // redis module passed in first agrument
    client = clientOrNodeRedis.createClient(                              // and we need to create a client
      constructorlastArgs.opts.clientOptions || {}                        // using the `opts.clientOptions` as configuration object for the client (defaulting to nothing)
    );
  }
  if (constructorlastArgs.cb !== noop) {                                  // if the callback is _not_ a noop...
    client.on('ready',constructorlastArgs.cb);                            // then have it called when the client is ready
  }

  return rediSearchObj = {
    createIndex       : createIndex,
    dropIndex         : dropIndex,
    
    add               : addFactory(client),
    getDoc            : getDocFactory(client),    
    search            : searchFactory(client),

    batch             : pipelineFactory('batch'),
    
    fieldDefinition   : fieldDefinition,
    client            : client                                            // the client specified is returned back for easy access (useful if the client created it)
  };
};