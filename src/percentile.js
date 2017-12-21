// Based on https://github.com/evgenyneu/SigmaSwiftStatistics/wiki/Percentile-1-method

/**

 Shared function for all quantile methods.
 - parameter data: Array of decimal numbers.
 - parameter k: the position of the element in the dataset.
 - parameter probability: the probability value between 0 and 1, inclusive.
 - returns: sample quantile.
 */
function qDef(data, k, probability) {
  if (data.length == 0) {
    return undefined;
  }
  if (k < 1) {
    return data[0];
  }
  if (k >= data.length) {
    return data[data.length - 1];
  }
  return (1.0 - probability) * data[k - 1] + probability * data[k];
}

/**

 This method is implemented in S, Microsoft Excel (PERCENTILE or PERCENTILE.INC) and Google Docs Sheets (PERCENTILE). It uses linear interpolation of the modes for the order statistics for the uniform distribution on [0, 1].
 - parameter data: Sorted array of decimal numbers.
 - parameter probability: the probability value between 0 and 1, inclusive.
 - returns: sample quantile.
 */
function percentile(data, probability) {
  if (probability < 0 || probability > 1) {
    return undefined;
  }
  let count = data.length;
  let m = 1.0 - probability;
  let k = parseInt(probability * count + m);
  probability = probability * count + m - parseFloat(k);
  return qDef(data, k, probability);
}

export { percentile };
