// 实现js浮点数的精确计算
// 原理，利用整数可以精确计算，先将浮点数全部转化为整数之后计算
//   最后将整数计算得到的值换算回浮点数
// 注意：不可计算小数点后位数特别长的数字，可能会发生溢出
// 因为采用了将小数转化为整数，然后再计算的方式，小数点后位数过多的话整数会很大

var getFloatLength = function(num) {
  var _num = num + '';
  var numAfterPoint = _num.split('.')[1];

  return numAfterPoint ? numAfterPoint.length : 0;
};

var _calc = function(baseNum, nums, action) {
  if (!nums || !nums.length) return null;

  if (baseNum || baseNum === 0) {
    nums.unshift(baseNum);
  }

  var floatLengths = nums.map(function(num) {
    return getFloatLength(num);
  });

  return _calc[action](nums, floatLengths);
};

_calc.plus = function(nums, floatLengths) {
  var maxFloatLength = Math.max.apply(null, floatLengths)
  var times = maxFloatLength > 0 ? Math.pow(10, maxFloatLength) : 1;

  var result = nums.reduce(function(curResult, curNum, index) {
    return curResult += _calc.multiply([curNum, times], [floatLengths[index], 0]);
  }, 0);

  return result / times;
};

_calc.minus = function(nums, floatLengths) {
  var maxFloatLength = Math.max.apply(null, floatLengths)
  var times = maxFloatLength > 0 ? Math.pow(10, maxFloatLength) : 1;
  var result = _calc.multiply([nums[0], times], [floatLengths[0], 0]);

  for(var i = 1, len = nums.length; i < len; i++) {
    result -= _calc.multiply([nums[i], times], [floatLengths[i], 0]);
  }

  return result / times;
};

_calc.multiply = function(nums, floatLengths) {
  var times = 1;

  var result = nums.reduce(function(curResult, curNum, index) {
    times *= Math.pow(10, floatLengths[index]);
    return curResult * parseInt(('' + curNum).replace('.', ''), 10);
  }, 1);

  return result / times;
};

_calc.divide = function(nums, floatLengths) {
  var denominator = _calc.multiply(nums.slice(1), floatLengths.slice(1));

  var numerator = parseInt(('' + nums[0]).replace('.', ''), 10);
  var numeratorTimes = Math.pow(10, floatLengths[0]);

  var firstResult = numerator / denominator;
  var secondResult = 1 / numeratorTimes;

  return _calc.multiply(
    [firstResult, secondResult],
    [getFloatLength(firstResult), getFloatLength(secondResult)]
  );
};

// 对外接口
var AccCalc = function() {
  this._value = null;
};

// 链式调用
AccCalc.prototype.plus = function() {
  this._value = _calc(this._value, Array.prototype.slice.apply(arguments), 'plus');
  return this;
};

AccCalc.prototype.minus = function() {
  this._value = _calc(this._value, Array.prototype.slice.apply(arguments), 'minus');
  return this;
};

AccCalc.prototype.multiply = function() {
  this._value = _calc(this._value, Array.prototype.slice.apply(arguments), 'multiply');
  return this;
};

AccCalc.prototype.divide = function(num1) {
  this._value = _calc(this._value, Array.prototype.slice.apply(arguments), 'divide');
  return this;
};

AccCalc.prototype.value = function(floatLength) {
  var tempValue = this._value;
  this._value = null;
  return isNaN(parseInt(floatLength, 10))
    ? tempValue
    : tempValue.toFixed(floatLength);
};

AccCalc.chain = function() {
  return new AccCalc();
}

// 非链式调用
AccCalc.plus = function() {
  return _calc(null, Array.prototype.slice.apply(arguments), 'plus');
};

AccCalc.minus = function() {
  return _calc(null, Array.prototype.slice.apply(arguments), 'minus');
};

AccCalc.multiply = function() {
  return _calc(null, Array.prototype.slice.apply(arguments), 'multiply');
};

AccCalc.divide = function() {
  return _calc(null, Array.prototype.slice.apply(arguments), 'divide');
};
