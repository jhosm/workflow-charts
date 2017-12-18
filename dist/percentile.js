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
    return ((1.0 - probability) * data[k - 1]) + (probability * data[k]);
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
    var count = data.length;
    var m = 1.0 - probability;
    var k = parseInt((probability * count) + m);
    probability = (probability * count) + m - parseFloat(k);
    return qDef(data, k, probability);
}
// Returns the percentile of the given value in a sorted numeric array.
function percentRank(arr, v) {
    if (typeof v !== 'number')
        throw new TypeError('v must be a number');
    var i = 0, l = arr.length;
    for (; i < l; i++) {
        if (v <= arr[i]) {
            while (i < l && v === arr[i])
                i++;
            if (i === 0)
                return 0;
            /* if (v !== arr[i-1]) {
                 i += (v - arr[i-1]) / (arr[i] - arr[i-1]);
             }*/
            return i / l;
        }
    }
    return 1;
}
export { percentile, percentRank };
//# sourceMappingURL=percentile.js.map