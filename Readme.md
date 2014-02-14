
# county_detector_collation

  Collate all detectors in highways in a county, move to couchdb

  When you're done, you can get stuff by hitting the URL

      http://127.0.0.1:5984/calvad%2Fcounty%2Fdetectors/_design/detectors/_view/fips_year?key=%5b%2206111%22,2007%5d&reduce=false


## Installation

  Install with npm

    $ npm install https://github.com/jmarca/county_detector_collation

## API

1. check if your name is James Marca
2. think twice about using this if 1 is false
3. read the source, but I'm pretty sure if you just run

        node app.js

it will do whatever it is supposed to do.  I haven't written app.js
yet, however.

## Tests

Tests are run with mocha.


## License

  The MIT License (MIT)

  Copyright (c) 2014 James E. Marca

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
