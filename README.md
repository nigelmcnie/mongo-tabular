Mongo Tabular
=============

By example:

```
dev> db.survey.find()
{ "_cls" : "Survey", "_id" : ObjectId("50457507fe75bd7531268485"), "_types" : [ "Survey" ], "created" : ISODate("2012-09-04T03:27:03.161Z"), "description" : "lkjasd\r\n\r\ntext formatting", "owner" : ObjectId("503af0a3fe75bd735335a27b"), "questions" : [   {   "_types" : [    "Question" ],   "required" : false,     "label" : "How?",   "_cls" : "Question",    "label_text" : "",  "id" : "oLM8w83sTaXEm5RyZ6yQXNcjncn2pJHLyPFe9_7XKs",    "show_other" : false,   "type" : "textarea",    "options" : [ ] },  {   "_types" : [    "Question" ], "required" : true,    "label" : "Why?",   "_cls" : "Question",    "label_text" : "",  "id" : "gHFQdcvZB_ELF9Qp6liMwcAoX-eVDVHNAMcdDrwHCM",    "show_other" : false,   "type" : "text",    "options" : [ ] },  {   "_types" : [    "Question" ],   "required" : false,     "label" : "Who?",   "_cls" : "Question",    "label_text" : "",  "id" : "2sTKV2QipESmWrP4tcXb4TmECxf5p1Tf0bOD6-zJib",    "show_other" : false,   "type" : "select",  "options" : [   "Bananaphone",  "Watman",   "Yo Mama" ] },  {   "_types" : [    "Question" ],   "required" : false,     "label" : "Testing",    "_cls" : "Question",    "label_text" : "",  "id" : "TketUNiBTZkOJoj3K2tw74mS_l_p0bDPcIT1UeVMiI",    "show_other" : false,   "type" : "select",  "options" : [   "one",  "two",  "three" ] } ], "status" : "open", "title" : "My first survey" }
{ "_cls" : "Survey", "_id" : ObjectId("5068fcbefe75bd3063635bd6"), "_types" : [ "Survey" ], "created" : ISODate("2012-10-01T02:15:26.114Z"), "description" : "Just to test another one", "owner" : ObjectId("503af0a3fe75bd735335a27b"), "questions" : [    {   "_types" : [    "Question" ],   "required" : false,     "label" : "Why did the monkey?",    "_cls" : "Question",    "label_text" : "",  "id" : "tH3x9-t4T_8l6KiObYKJQ-07uPiKxZNqb_q4qKqbw4",    "show_other" : false,   "type" : "text",    "options" : [ ] },  {   "_types" : [    "Question" ],   "required" : false,     "label" : "Why didn't the monkey?",     "_cls" : "Question",    "label_text" : "",  "id" : "LeA-E_Sa3Tp2-dQdgJG3pk0qQy0gE-42E2fFKG6aya",    "show_other" : false,   "type" : "textarea",    "options" : [ ] } ], "status" : "open", "title" : "My second survey" }
```

What a mess to try and read. How about this:

```
dev> db.survey.find().t()
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------+--------+--------------------+
|           _id            |   _cls   |    _types    |               created               |           description           |          owner           |                     questions                     | status |       title        | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------+--------+--------------------+
| 50457507fe75bd7531268485 | "Survey" | [ "Survey" ] | ISODate("2012-09-04T03:27:03.161Z") | "lkjasd\r\n\r\ntext formatting" | 503af0a3fe75bd735335a27b | [ { "_types" : [ "Question" ], "required" : fa... | "open" | "My first survey"  | 
| 5068fcbefe75bd3063635bd6 | "Survey" | [ "Survey" ] | ISODate("2012-10-01T02:15:26.114Z") | "Just to test another one"      | 503af0a3fe75bd735335a27b | [ { "_types" : [ "Question" ], "required" : fa... | "open" | "My second survey" | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------+--------+--------------------+
```

Grab `mongorc.js`, put it in `$HOME/.mongorc.js`. Start mongo. Call `.t()` on cursor
objects (e.g. the return result of `find()`). You're welcome.

Improvements most welcome. Mongodb devs, plz consider something similar for upstream?

Options to .t()
---------------
You can pass `.t()` a hash with the following keys:

* limit: Limits the number of rows in the output (which defaults to 20)
* maxlen: Values longer than this will be truncated to this length, to prevent stupidly long output (default 50)
* undef: A string representing what should be shown when a value is undefined for a given document

```
dev> db.survey.find().t({limit: 1, maxlen: 200})
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+--------+-------------------+
|           _id            |   _cls   |    _types    |               created               |           description           |          owner           |                                                                                             questions                                                                                             | status |       title       | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+--------+-------------------+
| 50457507fe75bd7531268485 | "Survey" | [ "Survey" ] | ISODate("2012-09-04T03:27:03.161Z") | "lkjasd\r\n\r\ntext formatting" | 503af0a3fe75bd735335a27b | [ { "_types" : [ "Question" ], "required" : false, "label" : "How?", "_cls" : "Question", "label_text" : "", "id" : "oLM8w83sTaXEm5RyZ6yQXNcjncn2pJHLyPFe9_7XKs", "show_other" : false, "type"... | "open" | "My first survey" | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+--------+-------------------+
```

Improving output formatting further
-----------------------------------
Observe that you can still pass useful things to `.find()`, for example to ditch columns from the output:

```
dev> db.survey.find(null, {questions: 0}).t({maxlen: 200})
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+--------+--------------------+
|           _id            |   _cls   |    _types    |               created               |           description           |          owner           | status |       title        | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+--------+--------------------+
| 50457507fe75bd7531268485 | "Survey" | [ "Survey" ] | ISODate("2012-09-04T03:27:03.161Z") | "lkjasd\r\n\r\ntext formatting" | 503af0a3fe75bd735335a27b | "open" | "My first survey"  | 
| 5068fcbefe75bd3063635bd6 | "Survey" | [ "Survey" ] | ISODate("2012-10-01T02:15:26.114Z") | "Just to test another one"      | 503af0a3fe75bd735335a27b | "open" | "My second survey" | 
+--------------------------+----------+--------------+-------------------------------------+---------------------------------+--------------------------+--------+--------------------+
```