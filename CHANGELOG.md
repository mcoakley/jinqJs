 DATE:     3/23/15
 VERSION:  .1.1
 NOTE:     Added leftJoin(), avg(), and predicate for on().

 DATE:     3/26/15
 VERSION:  .1.2
 NOTE:     Minor corrections

 DATE:     3/30/15
 VERSION   .1.3
 NOTE:     Added ability to sort asc/desc on plain arrays
           concat() and union()

 DATE:     4/1/15
 VERSION:  .1.4
 NOTE:     Added support for positional for orderBy and Select on {field: #} 
            objects

 DATE:     4/2/15
 VERSION:  .1.5
 NOTE:     Added ability to join() on() collections with simple arrays

 DATE:     4/3/15
 VESION:   .1.6
 NOTE:     Added index as 2nd parameter for .where() and .select()
           Added .not(), .in()

 DATE:     4/4/15
 VERSION   1.00
 NOTE:     Added ability to do .distinct(), .max(),. min(), .avg() on simple 
            arrays.
           Added ability to union simple arrays.
           .in() can except multiple columns to compare to.
           If .orderBy() uses positional, then all fields ordered must be 
            positional
           Added support for .identity() on simple arrays. When on simple 
            arrays the value gets set to a "Value" column by default.
           Included unit tests

 DATE:     4/11/15
 VERSION   1.13
 NOTE:     Made various performance improvements.
           Added new ability to perform Full Joins using .fullJoin() <-- Only 
            String columns, no expressions
           Added new function .skip().
           Added support for strong type comparison === and !== in .where() 
            when using expressions.
           Fixed an issue with the .not().in() function not properly working 
            when using multiple columns.

 DATE:     4/13/15
 VERSION   1.2a
 NOTE:     Added new function jinqJs.addPlugin() to allow extensibility. See 
            API documentation.

 DATE:     4/13/15
 VERSION   1.3
 NOTE:     Added module jinqJs to support node.js.

 DATE:     7/12/15
 VERSION   1.4
 NOTE:     Added the ability to support a single parameter as an array of 
            fields for the distinct().
           Thank you to jinhduong for contributing and your recommendation.

 DATE:     8/1/15
 VERSION:  1.5
 NOTE:     Did some code refactoring for getExpression() and isTruthy() 
            functions.
           Added new function filter(), filter() function is synonymous to 
            the where() function. The filter() is just a refernce to the 
            where() and can be used interchangeably.
           Added ability to now update rows inside an array. The update does 
            an in-place update (Referencing the original array), it is not 
            necessary to execute the select() when only performing an update 
            on the array. New functions update() and at() have been added.

 DATE:     8/3/15
 VERSION:  1.5.1
 NOTE:     Added .delete() for deleting records when the .at() is true.

 DATE:     8/12/15
 VERSION:  1.5.2
 NOTE:     Changed the .at() and .update() predicates first parameter not to 
            be a row object, but the array instead.
           The two parameters passed to the delegate are now (collection, 
            index). This was changed due to an issue when trying to update 
            simple arrays i.e. [1,2,3,4,5], since they are not object types 
            they were not getting updated.

 DATE:     11/24/15
 VERSION:  1.5.3
 NOTE:     Added support for TypeScript definition file.

 DATE:     11/24/15
 VERSION:  1.5.3
 NOTE:     Added support for TypeScript definition file.

 DATE:     12/5/15
 VERSION:  1.5.6
 NOTE:     Fixed bug when R-Value of an expression contained spaces.

 DATE:     1/3/16
 VERSION:  1.5.9
 NOTE:     Added jinqJs service for Angular 1.x

 DATE:     5/14/16
 VERSION:  1.6.0
 NOTE:     Thanks to gpminsuk for recommending a change to isObject() you 
            can now perform a select on an array that contains arrays.
           For example: .from([[1,2,3],[4,5,6]]).select(2)  Will return the 
            second element of each of the arrays in the root array.

 DATE      9/18/16
 VERSION:  1.6.1
           Thanks to gpminsuk for finding an issue when a propery in a 
            collection had a 0 value, a null was returned! See Issue #16
           Thanks to pascalberge, moved the jinqJs definition file to 
            scripts\typings\jinqJs.
           Thanks to pemn, for finding if a collection has been added using a 
            from() and then later .delete().at() is called with no parameters,
            the internal variable collections is not being cleared.
           Thanks to ninety7 for suggesting using string.localeCompare() 
            for ordering.
