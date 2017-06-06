# acc-calc

It's a javascript library used to accurate calcurate, it only supports plus, minus, multiply and divide operation.

### Install
```bash
npm install acc-calc
```

### Use
```javascript
const accCalc = require('acc-calc');

// 0.2 + 0.4 + 0.1
accCalc.plus(0.2, 0.4, 0.1);
// or
accCalc.chain().plus(0.2, 0.4, 0.1).value();
// or
accCalc.chain().plus(0.2).plus(0.4).plus(0.1).value();
// or
accCalc.chain().plus(0.2, 0.4).plus(0.1).value();

// (0.2 + 0.4) * 10 / 100 - 0.2 = -0.14
accCalc.chain().plus(0.2, 0.4).multiply(10).divide(100).minus(0.2).value(); // -0.14

// specify the result length, it will return a string value
accCalc.chain().plus(0.2, 0.4).multiply(10).divide(100).minus(0.2).value(1); //'-0.1'
```
