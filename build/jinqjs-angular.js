(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {

angular
  .module('angular-jinqjs', [])
  .service('$jinqJs', function() {
    var jinqJs = require("./jinqjs.js");
    
    return new jinqJs(); 
  })
  .service("$jinqJs-webservice-plugin", function() {
    var WebServicePlugin = require('./../plugins/browser/webservice-plugin.js');
    
    return new WebServicePlugin();
  });

})();

},{"./../plugins/browser/webservice-plugin.js":4,"./jinqjs.js":2}],2:[function(require,module,exports){
/******************************************************************************
 The MIT License (MIT)

 Copyright (c) 2015 THOMAS FORD

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 AUTHOR: Thomas Ford
 DATE:   3/21/2015
         http://jinqJs.com
 *****************************************************************************/

(function() {

  var jinqJs = function (settings) {

  /* Private Variables */
    var collections = [],
      result = [],
      groups = [],
      notted = false,
      identityUsed = false,
      delegateUpdate = null,
      deleteFlag = false,
      operators = {
        LessThen: 0,
        LessThenEqual: 1,
        GreaterThen: 2,
        GreaterThenEqual: 3,
        Equal: 4,
        EqualEqualType: 5,
        NotEqual: 6,
        NotEqualEqualType: 7,
        Contains: 8
      },
      storage = {};
    
    var utils = require("./utils.js");

    jinqJs.settings = jinqJs.settings || {};

  /* Constructor Code */
    if (typeof settings !== "undefined") {
      jinqJs.settings = settings;
    }
    jinqJs.settings.includeIdentity = jinqJs.settings.includeIdentity || false;
    jinqJs.settings.identityName = jinqJs.settings.identityName || "ID";

  /* Private Methods (no prefix) */
    var arrayItemFieldValueExists = function (collection, field, value) {
        for (var index = 0; index < collection.length; index++) {
          if (collection[index][field] === value) { return true; }
        }

        return false;
      },

      arrayFindItem = function (collection, obj, findFirst) {
        var row = null;
        var isMatch = false;
        var ret = [];
        var isObj = false;

        findFirst = findFirst || false;
        for (var index = 0; index < collection.length; index++) {
          isMatch = false;
          for (var field in obj) {
            row = collection[index];
            isObj = utils.isObject(row);
            if ((!isObj && row !== obj[field]) || 
            (isObj && row[field] !== obj[field])) 
          {
              isMatch = false;
              break;
            }

            isMatch = true;
          }

          if (isMatch) {
            if (findFirst) {
              return row;
            } else {
              ret.push(row);
            }
          }
        }

        return ret.length === 0 ? null : ret;
      },

      arrayFindFirstItem = function (collection, obj) {
        return arrayFindItem(collection, obj, true);
      },

      condenseToFields = function (obj, fields) {
        var newObj = {};
        var field = null;

        for (var index = 0; index < fields.length; index++) {
          field = fields[index];

          if (utils.hasProperty(obj, field)) {
            newObj[field] = obj[field];
          } else {
            newObj[field] = 0;
          }
        }

        return newObj;
      },

      aggregator = function (args, predicate) {
        var collection = [];
        var keys = null;
        var values = null;
        var row = null;

        for (var index = 0; index < result.length; index++) {
          keys = condenseToFields(result[index], groups);
          values = condenseToFields(result[index], args);

          row = arrayFindFirstItem(collection, keys);
          if (row === null) {
            row = {};
            for (var keyField in keys) {
              row[keyField] = keys[keyField];
            }

            for (var valField in values) { 
              row[valField] = predicate(row[valField], 
              values[valField], 
              JSON.stringify(keys) + valField
            );
            }

            collection.push(row);
          } else {
            for (var vField in values) {
              row[vField] = predicate(row[vField], 
              result[index][vField], 
              JSON.stringify(keys) + vField
            );
            }
          }
        }

        groups = [];
        return collection;
      },

      orderByComplex = function (complexFields) {
        var complex = null;
        var prior = null;
        var field = null;
        var firstField = null;
        var secondField = null;
        var priorFirstField = null;
        var priorSecondField = null;
        var order = 1;
        var isNumField = false;

        for (var index = 0; index < complexFields.length; index++) {
          prior = index > 0 ? complexFields[index - 1] : null;
          complex = complexFields[index];
          field = utils.hasProperty(complex, "field") ? complex.field : null;
          order = utils.hasProperty(complex, "sort") && 
          complex.sort === "desc" ? -1 : 1;
          isNumField = field !== null && !isNaN(field) ? true : false;

          result.sort(function (first, second) {
            var lValueIsLess = false;
            var lValueIsGreater = false;
            var lValue = null;
            var rValue = null;

            if (isNumField) {
              firstField = Object.keys(first)[field];
              secondField = Object.keys(second)[field];

              if (prior !== null) {
                priorFirstField = Object.keys(first)[prior.field];
                priorSecondField = Object.keys(second)[prior.field];
              }
            } else {
              firstField = secondField = field;

              if (prior !== null) {
                priorFirstField = priorSecondField = prior.field;
              }
            }

            lValue = field === null ? 
              first : isNaN(first[firstField]) || first[firstField] === "" ? 
                first[firstField] : Number(first[firstField]);
            rValue = field === null ? 
              second : isNaN(second[secondField]) || second[secondField] === "" ?
                second[secondField] : Number(second[secondField]);

            if (utils.isString(lValue) && utils.isString(rValue)) {
              var localeComparison = lValue.localeCompare(rValue);

              switch (localeComparison) {
              case -1:
                lValueIsLess = true;
                break;
              case 1:
                lValueIsGreater = true;
                break;
              }
            } else {
              lValueIsLess = lValue < rValue;
              lValueIsGreater = lValue > rValue;
            }

            if (lValueIsLess && 
            (prior === null || (field === null || 
              first[priorFirstField] === second[priorSecondField])
            )
          ) {
              return -1 * order;
            }

            if (lValueIsGreater && 
            (prior === null || (field === null || 
              first[priorFirstField] === second[priorSecondField])
            )
          ) {
              return 1 * order;
            }
          
            return 0;
          });
        }
      },

      flattenCollection = function (collection) {
      // This is done for optimal performance
        switch (collection.length) {
        case 1:
          return collection[0].concat();
        case 2:
          return [].concat(collection[0], collection[1]);
        case 3:
          return [].concat(collection[0], collection[1], collection[2]);
        case 4:
          return [].concat(collection[0], collection[1], collection[2], 
          collection[3]);
        case 5:
          return [].concat(collection[0], collection[1], collection[2], 
          collection[3], collection[4]);
        default:
          var flatCollection = [];

          for (var index = 0; index < collection.length; index++) { 
            flatCollection = flatCollection.concat(collection[index]);
          }

          return flatCollection;
        }
      },

    /* Possible future use */
    /*
    pluckRowByMissingField = function (collection, args) {
      var ret = [];
      var bIsMissing = false;

      if (args.length === 0) {
        return collection;
      }

      for (var index = 0; index < collection.length; index++) {
        bIsMissing = false;
        for (var iArg = 0; iArg < args.length; iArg++) {
          if (!utils.hasProperty(collection[index], args[iArg])) {
            bIsMissing = true;
            break;
          }
        }

        if (!bIsMissing) {
          ret.push(collection[index]);
        }
      }

      return ret;
    },
    */

      mergeObjectsFields = function (objects) {
        var obj = {};

        for (var index = 0; index < objects.length; index++) {
          for (var prop in objects[index]) {
            obj[prop] = objects[index][prop];
          }
        }

        return obj;
      },

      convertToEmptyObject = function (obj) {
        var o = {};

        for (var field in obj) {
          o[field] = "";
        }

        return o;
      },

      convertToOperatorEnum = function (operator) {
        switch (operator) {
        case "<":
          return operators.LessThen;
        case ">":
          return operators.GreaterThen;
        case "!=":
          return operators.NotEqual;
        case "!==":
          return operators.NotEqualEqualType;
        case "=":
        case "==":
          return operators.Equal;
        case "===":
          return operators.EqualEqualType;
        case "<=":
          return operators.LessThenEqual;
        case ">=":
          return operators.GreaterThenEqual;
        case "*":
          return operators.Contains;
        default:
          throw new Error("Invalid Operator! (" + operator + ")");
        }
      },

      convertToFieldArray = function (obj) {
        var array = [];

        for (var field in obj) {
          array.push({
            field: field
          });
        }

        return array;
      },

      onFromJoin = function (joinType, comparers) {
        var row = null;
        var ret = [];
        var matches = null;
        var collection = [];
        var startIndex = 1;

      // MJC 12/10/2016
      // There is no logical way for these tests to evalute to true given
      // the checks in all of the methods that call onFromJoin (one), 
      // therefore, this check has been removed.
      /*
      if (!utils.isArray(comparers) || comparers.length === 0 || 
        collections.length === 0
      ) {
        return;
      }
      */

        switch (joinType) {
        case "from":
        // If we have just one pending collection then just return it, 
        //  there is nothing to join it with
          if (collections.length === 1) {
            result = collections[0];
            return;
          }

          collection = collections[0];
          break;

        case "full":
        case "inner":
        case "left":
          collection = result;
          startIndex = 0;
          break;

        default:
          return;
        }

        for (var index = startIndex; index < collections.length; index++) {
          ret = [];

          collection.forEach(function (lItem) {
            if (utils.isFunction(comparers[0])) {
              matches = [];
              collections[index].forEach(function (item) {
                if (comparers[0](lItem, item)) {
                  matches.push(item);
                }
              });

            // This condition is used to handle left joins with a predicate
              if (matches.length === 0) {
                matches = null;
              }
            } else {
              row = condenseToFields(lItem, comparers);
              matches = arrayFindItem(collections[index], row);
            }

            if (matches !== null) {
              if (utils.isString(matches[0])) {
                ret.push(lItem);
              } else {
                matches.forEach(function (rItem) {
                  ret.push(mergeObjectsFields([rItem, lItem]));
                });
              }
            } else {
              if (joinType === "left" || joinType === "full") {
                if (collections[index].length > 0) {
                // The order of merging objects is important here, 
                // right -> left
                  row = convertToEmptyObject(collections[index][0]);
                  row = mergeObjectsFields([row, lItem]);
                }
                ret.push(mergeObjectsFields([lItem, row]));
              }
            }
          });

        // Next get the elements on the right that are not in the result
          if (joinType === "full") {
            var z = new jinqJs().from(collections[index])
            .not().in(ret, comparers).select(convertToFieldArray(ret[0]));
            ret = ret.concat(z);
          }

          collection = ret;
        }

        collections = [];
        result = ret;
      },

      isAppropriateArg = function(item) {
        return item !== null && 
        (((utils.isArray(item) || utils.isString(item)) && item.length > 0) ||
          (utils.isObject(item) && !utils.isFunction(item)));
      },

      joinIt = function (joinType, args) {
        if (args.length === 0) {
          return;
        }

        collections = [];
        collections.func = joinType;
        for (var index = 0; index < args.length; index++) {
          if (isAppropriateArg(args[index])) {
            collections.push(args[index]);
          }
        }
      },

      getExpressions = function (args) {
        var regExpr = /([^\s]+)\s(<|>|!=|!==|=|==|===|<=|>=|\*)\s(.+)/;
        var argLen = args.length;
        var expr = new Array(argLen);

        for (var eIndex = 0; eIndex < argLen; eIndex++) {
          var matches = args[eIndex].match(regExpr);

        // MJC 12/11/2016
        // RexEx checks return null for no match
          if (matches === null) {
            throw new Error("Invalid expression - must have four parts! (" + 
            args[eIndex] + ")");
          }

          expr[eIndex] = {
            lField: matches[1],
            operator: convertToOperatorEnum(matches[2]),
            rValue: matches[3]
          };
        }

        return expr;
      },

      isTruthy = function (row, expr) {
        switch (expr.operator) {
        case operators.EqualEqualType:
          return (row[expr.lField] === expr.rValue);

        case operators.NotEqualEqualType:
          return (row[expr.lField] !== expr.rValue);

        case operators.LessThen:
          return (row[expr.lField] < expr.rValue);

        case operators.GreaterThen:
          return (row[expr.lField] > expr.rValue);

        case operators.NotEqual:
          // eslint-disable-next-line eqeqeq
          return (row[expr.lField] != expr.rValue); 

        case operators.Equal:
          // eslint-disable-next-line eqeqeq
          return (row[expr.lField] == expr.rValue);

        case operators.LessThenEqual:
          return (row[expr.lField] <= expr.rValue);

        case operators.GreaterThenEqual:
          return (row[expr.lField] >= expr.rValue);

        case operators.Contains:
          return (row[expr.lField].indexOf(expr.rValue) > -1);

        default:
          return false;
        }
      };

  /* Exposed Methods (prefixed with _) */
    var _flattenFromData = function() {
        collections.func = "from";
        result = flattenCollection(collections);
        return this;
      },
    
      _from = function () {
        var collection = null;
        var callback = null;
        var collectionsLen = collections.length;

        result = [];
        if (arguments.length === 0) {
          return this;
        }
      
        if (arguments.length === 2 && utils.isFunction(arguments[1])) {
          collection = arguments[0];
          callback = arguments[1];

          if (utils.isString(collection)) {
            throw new Error("Web service calls no longer directly supported. " +
            "Use the fromWebService plugin for this type of call.");
          }
        
          collections.push(collection);
        } else {
          for (var index = 0; index < arguments.length; index++) {
          // MJC 12/09/2016
          // The original check here:
          //   if (arguments[index] === null || 
          //     arguments[index].length === 0 ||
          //     utils.isFunction(arguments[index])
          //
          // Was moved into a function (isAppropriateArg) in order to be used 
          // here AND in the joinIt function.
            if (isAppropriateArg(arguments[index])) {
              collections.push(arguments[index]);
            }
          }
        }
      
        if (collections.length > collectionsLen) {
          _flattenFromData();
        }

        return (utils.isFunction(callback) ? callback(this) : this);
      },

      _select = function () {
        var fields = null;
        var fieldIsObject = false;
        var fieldIsPredicate = false;
        var fieldDefs = null;
        var collection = null;
        var obj = null;
        var srcFieldName = null;
        var dstFieldName = null;
        var isSimple = false;
      
      // MJC: 12/8/2016
      // Reordered the testing of conditions for early exit. This order 
      // ensures that if we are exiting early we send truly empty results
      // even if we are adding an identity field.
        if (utils.isEmpty(result)) {
          return [];
        }

        if (jinqJs.settings.includeIdentity && !identityUsed) {
          _identity();
        }
      
        if (utils.isEmpty(arguments)) {
          return result;
        }

        isSimple = !utils.isObject(result[0]);
        collection = new Array(result.length);
      
      // Determine how we were called.
        if (utils.isArray(arguments[0])) {
          fieldIsObject = true;

          fields = arguments[0];
          fieldDefs = new Array(fields.length);

          for (var fIndex = 0; fIndex < fields.length; fIndex++) {
            fieldDefs[fIndex] = {
              hasField: utils.hasProperty(fields[fIndex], "field"),
              hasText: utils.hasProperty(fields[fIndex], "text"),
              hasValue: utils.hasProperty(fields[fIndex], "value")
            };
          }
        } else if (utils.isFunction(arguments[0])) {
          fieldIsPredicate = true;

          fields = arguments[0];
        } else {
          fields = arguments;
        }

        for (var index = 0; index < result.length; index++) {
          if (fieldIsPredicate) {
            collection[index] = fields(result[index], index);
          } else {
            obj = {};

            for (var field = 0; field < fields.length; field++) {
              if (fieldIsObject) {
                if (fieldDefs[field].hasField) {
                  if (!utils.isNumber(fields[field].field)) {
                    srcFieldName = fields[field].field;
                  } else {
                    srcFieldName = 
                    Object.keys(result[index])[fields[field].field];
                  }
                }

                dstFieldName = (fieldDefs[field].hasText ? 
                fields[field].text : fields[field].field);
              } else {
                dstFieldName = srcFieldName = fields[field];
              }

              if (fieldIsObject && fieldDefs[field].hasValue) {
                if (utils.isFunction(fields[field].value)) {
                  obj[dstFieldName] = fields[field].value(result[index]);
                } else { 
                  obj[dstFieldName] = fields[field].value;
                }
              } else {
                obj[dstFieldName] = isSimple ? 
                result[index] : result[index][srcFieldName] === 0 ? 
                  0 : result[index][srcFieldName] || null;
              }
            }

            collection[index] = obj;
          }
        }

        return collection;
      },

      _update = function (predicate) {
        if (deleteFlag) {
          throw new Error("A pending delete operation exists!");
        }
        if (delegateUpdate !== null) { 
          throw new Error("A pending update operation exists!"); 
        }
      // MJC: 12/8/2016
      // Simplified this check: removed check
      // -> typeof predicate === "undefined"
      // since isFunction will only return true if it is a valid function
        if (!utils.isFunction(predicate)) {
          throw new Error("You must define a predicate for update()");
        }

        delegateUpdate = predicate;

        return this;
      },

      _delete = function () {
        if (delegateUpdate !== null) { 
          throw new Error("A pending update operation exists!"); 
        }
        if (deleteFlag) {
          throw new Error("A pending delete operation exists!");
        }

        deleteFlag = true;

        return this;
      },

      _at = function () {
        var resLen = result.length;
        var expr = null;
        var isPredicateFunc = false;
        var predicateFunc = null;
        var isTruthful = false;
        var argLen = arguments.length;

        if ((delegateUpdate === null && !deleteFlag) || resLen === 0) {
          return this;
        }

      // Check if this is just clearing all data
        if (deleteFlag && argLen === 0) {
          result = [];
          collections = [];

          delegateUpdate = null;
          deleteFlag = false;

          return this;
        }

      // When performing coverage testing and focusing on only the 
      // .delete method it is impossible to check the implied else of the
      // statement below. (It is handled in the check above). Therefore,
      // you can simply ignore this one exception within the coverage report.
        if (argLen > 0) {
          isPredicateFunc = utils.isFunction(arguments[0]);
          if (!isPredicateFunc) {
            expr = getExpressions(arguments);
          } else {
            predicateFunc = arguments[0];
          }
        }

        for (var index = resLen - 1; index > -1; index--) {
          if (isPredicateFunc) {
            if (predicateFunc(result, index)) {
              if (deleteFlag) {
                result.splice(index, 1);
              } else {
                delegateUpdate(result, index);
              }
            }
          } else if (argLen === 0 && !deleteFlag) {
          // MJC: 12/8/2016
          // This has been simplified to only pass for the update
          // method. This is because if the deleteFlag is set AND 
          // we have zero arguments this case has been handled already.
            delegateUpdate(result, index);
          } else {
            for (var arg = 0; arg < argLen; arg++) {
              isTruthful = isTruthy(result[index], expr[arg]);

              if (!isTruthful) {
                break;
              }
            }

            if (isTruthful) {
              if (deleteFlag) {
                result.splice(index, 1);
              } else {
                delegateUpdate(result, index);
              }
            }
          }
        }

        delegateUpdate = null;
        deleteFlag = false;

        return this;
      },

      _concat = function () {
        collections.func = null;

        for (var index = 0; index < arguments.length; index++) {
          result = result.concat(arguments[index]);
        }

        return this;
      },

      _top = function (amount) {
        var totalRows = 0;

      // Check for a percentage
        if (amount > -1 && amount < 1) {
          totalRows = result.length * amount;
        } else {
          totalRows = amount;
        }

        if (amount < 0) {
          result = result.slice(totalRows, 
          result.length - Math.abs(totalRows) * -1);
        } else {
          result = result.slice(0, totalRows);
        }

        return this;
      },

      _bottom = function (amount) {
        _top(amount * -1);

        return this;
      },

      _where = function (predicate) {
        var collection = [];
        var isPredicateFunc = false;
        var isTruthful = false;
        var argLen = arguments.length;
        var resLen = result.length;
        var expr = null;
        var row = null;

        if (typeof predicate === "undefined") {
          return this;
        }

        isPredicateFunc = utils.isFunction(predicate);

        if (!isPredicateFunc) {
          expr = getExpressions(arguments);
        }

        for (var index = 0; index < resLen; index++) {
          row = result[index];

          if (isPredicateFunc) {
            if (predicate(row, index)) {
              collection.push(row);
            }
          } else {
            for (var arg = 0; arg < argLen; arg++) {
              isTruthful = isTruthy(row, expr[arg]);

              if (!isTruthful) {
                break;
              }
            }

            if (isTruthful) {
              collection.push(row);
            }
          }
        }

        result = collection;

        return this;
      },

      _distinct = function () {
        var collection = [];
        var row = null;
        var field = null;
        var index = 0;
        var len = result.length;
        var collSize = 0;
        var dupp = false;

        if (arguments.length === 0) {
          if (utils.isObject(result[0])) {
            for (index = 0; index < len; index++) {
              dupp = false;
              for (var i = 0; i < collSize; i++) {
                if (result[index] !== collection[i]) {
                  continue;
                }

                dupp = true;
                break;
              }

              if (!dupp) {
                collection[collSize++] = result[index];
              }
            }
          } else {
            var obj = {};
            for (index = 0; index !== len; index++) {
              row = result[index];
              if (obj[row] !== 1) {
                obj[row] = 1;
                collection[collection.length] = row;
              }
            }
          }
        } else {
          var argsDistinct = arguments;
          if (Array.isArray(arguments[0])) {
            argsDistinct = arguments[0];
          }

          for (index = 0; index < len; index++) {
            row = condenseToFields(result[index], argsDistinct);
            for (var fieldIndex = 0; 
            fieldIndex < argsDistinct.length; 
            fieldIndex++
          ) {
              field = argsDistinct[fieldIndex];
              if (!arrayItemFieldValueExists(collection, field, row[field])) {
                collection.push(row);
                break;
              }
            }
          }
        }

        result = collection;

        return this;
      },

      _groupBy = function () {
        groups = arguments;

        return this;
      },

      _sum = function () {
        var sum = {};

        if (groups.length === 0) {
          sum = 0;
          for (var index = 0; index < result.length; index++) {
            sum += arguments.length === 0 ? 
            result[index] : result[index][arguments[0]];
          }

          result = [sum];
        } else {
          result = aggregator(arguments, function (lValue, rValue, keys) {
            var key = keys; // JSON.stringify(keys);

            if (!utils.hasProperty(sum, key)) { 
              sum[key] = 0;
            }

            return sum[key] += rValue;
          });
        }

        return this;
      },

      _avg = function () {
        var avg = {};

        if (groups.length === 0) {
          avg = 0;
          for (var index = 0; index < result.length; index++) {
            avg += arguments.length === 0 ? 
            result[index] : result[index][arguments[0]];
          }

          result = [avg / result.length];
        } else {
          result = aggregator(arguments, function (lValue, rValue, keys) {
            var key = JSON.stringify(keys);

            if (!utils.hasProperty(avg, key)) { 
              avg[key] = {
                count: 0, sum: 0 
              };
            }

            avg[key].count++;
            avg[key].sum += rValue;

            return avg[key].sum / avg[key].count;
          });
        }

        return this;
      },

      _count = function () {
        var total = {};

        result = aggregator(arguments, function (lValue, rValue, keys) {
          var key = JSON.stringify(keys);

          if (!utils.hasProperty(total, key)) {
            total[key] = 0;
          }

          return ++total[key];
        });

        return this;
      },

      _min = function () {
        var minValue = {};
        var value = 0;

        if (groups.length === 0) {
          minValue = -1;
          for (var index = 0; index < result.length; index++) {
            value = arguments.length === 0 ? 
            Number(result[index]) : Number(result[index][arguments[0]]);
            minValue = (value < minValue || minValue === -1 ? value : minValue);
          }

          result = [minValue];
        } else {
          result = aggregator(arguments, function (lValue, rValue, keys) {
            var key = JSON.stringify(keys);

            if (!utils.hasProperty(minValue, key) || rValue < minValue[key]) { 
              minValue[key] = rValue;
            }

            return minValue[key];
          });
        }

        return this;
      },

      _max = function () {
        var maxValue = {};
        var value = 0;

        if (groups.length === 0) {
          maxValue = -1;
          for (var index = 0; index < result.length; index++) {
            value = arguments.length === 0 ? 
            Number(result[index]) : Number(result[index][arguments[0]]);
            maxValue = value > maxValue || maxValue === -1 ? value : maxValue;
          }

          result = [maxValue];
        } else {
          result = aggregator(arguments, function (lValue, rValue, keys) {
            var key = JSON.stringify(keys);

            if (!utils.hasProperty(maxValue, key) || rValue > maxValue[key]) {
              maxValue[key] = rValue;
            }

            return maxValue[key];
          });
        }

        return this;
      },

      _identity = function () {
        var id = 1;
        var isSimple = result.length > 0 && !utils.isObject(result[0]);
        var ret = [];
        var obj = null;

        var label = arguments.length === 0 ? 
        jinqJs.settings.identityName : arguments[0];

        identityUsed = true;
        for (var index = 0; index < result.length; index++) {
          if (isSimple) {
            obj = {};
            obj[label] = id++;
            obj.Value = result[index];

            ret.push(obj);
          } else {
            result[index][label] = id++;
          }
        }

        if (isSimple) {
          result = ret;
        }

        return this;
      },

      _orderBy = function () {
        var fields = arguments;

        if (arguments.length > 0 && utils.isArray(arguments[0])) {
          orderByComplex(arguments[0]);
          return this;
        }

        result.sort(function (first, second) {
        // 0  Equals
        // -1 Less then
        // 1  Greater then

          var firstFields = JSON.stringify(condenseToFields(first, fields));
          var secondFields = JSON.stringify(condenseToFields(second, fields));

          return firstFields.localeCompare(secondFields);
        });

        return this;
      },

      _union = function () {
        if (arguments.length === 0 || !utils.isArray(arguments[0]) || 
        arguments[0].length === 0
      ) { 
          return this;
        }

        if (!utils.isObject(arguments[0][0])) {
          for (var index = 0; index < arguments.length; index++) {
            _concat(arguments[index]);
          }

          _distinct();
        } else {
          var collection = flattenCollection(arguments);

          _concat(collection);
          groups = [];
          for (var field in arguments[0][0]) {
            groups.push(field);
          }

          _count();
        }

        return this;
      },

      _on = function () {
        if (arguments.length === 0 || !utils.hasProperty(collections, "func")) {
          return this;
        }

        onFromJoin(collections.func, arguments);
        collections.func = null;

        return this;
      },

      _in = function () {
        var ret = [];
        var outerField = null;
        var innerField = null;
        var match = false;
        var fields = [];
        var collection = null;

        if (arguments.length === 0) { return this; }

        collection = arguments[0];
        if (collection.length === 0 || result.length === 0) {
          return this;
        }

        var isInnerSimple = !utils.isObject(collection[0]);
        var isOuterSimple = !utils.isObject(result[0]);

        if ((!isInnerSimple || !isOuterSimple) && arguments.length < 2) {
          throw new Error("Invalid field or missing field!");
        }

        if (arguments.length < 2) {
          fields = [0];
        } // Just a dummy position holder
        else {
          if (utils.isArray(arguments[1])) {
            fields = arguments[1];
          } else {
            for (var i = 1; i < arguments.length; i++) {
              fields.push(arguments[i]);
            }
          }
        }

        var matches = 0;
        for (var outer = 0; outer < result.length; outer++) {
          for (var inner = 0; inner < collection.length; inner++) {
            matches = 0;
            for (var index = 0; index < fields.length; index++) {
              outerField = (isOuterSimple ? 
              result[outer] : result[outer][fields[index]]);
              innerField = (isInnerSimple ? 
              collection[inner] : collection[inner][fields[index]]);

              match = (outerField === innerField);

              if (match) {
                matches++;
              }
            }

            if (matches === fields.length) {
              break;
            }
          }

          if ((inner < collection.length && !notted) || 
          (inner === collection.length && notted)
        ) {
            ret.push(result[outer]);
          }
        }

        notted = false;
        result = ret;
        return this;
      },

      _join = function () {
        joinIt("inner", arguments);

        return this;
      },

      _leftJoin = function () {
        joinIt("left", arguments);

        return this;
      },

      _fullJoin = function () {
        joinIt("full", arguments);

        return this;
      },

      _not = function () {
        notted = true;

        return this;
      },

      _skip = function () {
        var totalRows = 0;

        if (arguments.length === 0 || !utils.isNumber(arguments[0])) {
          return this;
        }

      // Check for a percentage
        var amount = arguments[0];
        if (amount > -1 && arguments[0] < 1) {
          totalRows = result.length * amount;
        } else {
          totalRows = amount;
        }

        result = result.slice(totalRows);

        return this;
      };

  // Globals
    this.flattenFromData = _flattenFromData;
    this.from = _from;
    this.select = _select;
    this.update = _update;
    this.top = _top;
    this.bottom = _bottom;
    this.where = _where;
    this.distinct = _distinct;
    this.groupBy = _groupBy;
    this.sum = _sum;
    this.count = _count;
    this.min = _min;
    this.max = _max;
    this.avg = _avg;
    this.identity = _identity;
    this.orderBy = _orderBy;
    this.on = _on;
    this.join = _join;
    this.leftJoin = _leftJoin;
    this.fullJoin = _fullJoin;
    this.concat = _concat;
    this.union = _union;
    this.not = _not;
    this.in = _in;
    this.skip = _skip;
    this.filter = _where;
    this.at = _at;
    this.delete = _delete;
  
    this._x = function (name, args, plugin, pluginType) {
      storage[name] = storage[name] || {};
      switch (pluginType) {
      case "select":
        return plugin.call(this, result, args, storage[name]);
      case "from":
        return plugin.call(this, collections, args, storage[name]);
      default:
        throw new Error("Illegal plugin type (" + pluginType + ")");
      }
    };
  };

  jinqJs.addPlugin = function (name, plugin, pluginType) {
    pluginType = pluginType || "select";
  
    jinqJs.prototype[name] = function () { 
      return this._x(name, arguments, plugin, pluginType); 
    };
  };

  module.exports = jinqJs;

})();

},{"./utils.js":3}],3:[function(require,module,exports){
(function() {

  var isEmpty = function (array) {
      return typeof array === "undefined" || array.length === 0;
    },
  
    isObject = function (obj) {
      var type = typeof obj;
      return obj !== null && (type === "object" || type === "function");
    },
  
    isString = function (str) {
      return str !== null && str.constructor === String;
    },
  
    hasProperty = function (obj, property) {
      return obj[property] !== undefined;
    },
  
    isFunction = function (func) {
      return typeof func === "function";
    },
  
    isNumber = function (value) {
      return typeof value === "number";
    },
  
    isArray = function (array) {
    // MJC 12/10/2016
    // Reordered the sequence for early exit. Moved !isString(array) to 
    // be first since both a string and an array can have the property
    // length you will always need at least two checks to determine if 
    // the item is a string or not. In this order we will exit one 
    // function call earlier if it is a string.
      return !isString(array) && hasProperty(array, "length") && 
      !isFunction(array);
    };
  
  module.exports.isEmpty = isEmpty;
  module.exports.isObject = isObject;
  module.exports.isString = isString;
  module.exports.hasProperty = hasProperty;
  module.exports.isFunction = isFunction;
  module.exports.isNumber = isNumber;
  module.exports.isArray = isArray;
  
})();

},{}],4:[function(require,module,exports){
(function() {
  
  var WebServicePlugin = function() {

    // eslint-disable-next-line no-unused-vars
    this.from = function(collections, args, storage) {
      var utils = require("../../lib/utils.js");
      var xmlhttp = new XMLHttpRequest();
      
      var url = null;
      var callback = null;
      var self = this;

      if (args.length === 0) {
        return this;
      }

      if (args.length !== 2 || !utils.isString(args[0])) {
        throw new Error("The WebServicePlugin requires two arguments");
      }
    
      url = args[0];
      callback = args[1];

      var data = null;

      if (utils.isFunction(callback)) {
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.response.length === 0) {
            return;
          }

          data = JSON.parse(xmlhttp.response);

          if (!utils.isArray(data)) {
            data = new Array(data);
          }

          collections.push(data);

          callback(self);
        };
      }

      xmlhttp.open("GET", url, utils.isFunction(callback));
      xmlhttp.send();

      if (!utils.isFunction(callback)) {
        data = JSON.parse(xmlhttp.response);

        if (!utils.isArray(data)) {
          data = new Array(data);
        }

        collections.push(data);
      }

      return this;
    };
  };

  module.exports = WebServicePlugin;

})();

},{"../../lib/utils.js":3}]},{},[1]);
