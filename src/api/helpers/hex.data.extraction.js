

//hex to decimal conversion
const hextodecimal = (hexString => {
    return parseInt(hexString, 16);
})


//hex to text conversion
const hextoascii = (hexString => {

    let hex = hexString.toString();//force conversion
    let str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
})


// calculated data extraction
const calcDataFunc = (calculatedDataHexString => {

    let first = calculatedDataHexString.slice(0, 2).join("");
    let second = calculatedDataHexString.slice(2, 4).join("");
    
    let bpObj = {}
    bpObj.sys = hextodecimal(first);
    bpObj.dis = hextodecimal(second);
    return bpObj;
})


// date ecxtraction
const dateFunc = (dateHexString => {
    let dateObj = {}
    let ddHex = dateHexString.slice(0, 1).join("");
    let mmHex = dateHexString.slice(1, 2).join("");
    let yyHex = dateHexString.slice(2, 3).join("");
    let hhHex = dateHexString.slice(3, 4).join("");
    let minHex = dateHexString.slice(4, 5).join("");
    let ssHex = dateHexString.slice(5, 6).join("");

    dateObj.dd = hextodecimal(ddHex);
    dateObj.mm = hextodecimal(mmHex);
    dateObj.yy = hextodecimal(yyHex);
    dateObj.hh = hextodecimal(hhHex);
    dateObj.min = hextodecimal(minHex);
    dateObj.ss = hextodecimal(ssHex);

    return dateObj
})


// package length
const packageLength = (hexDataHeader => {

    let packageLengthHexString = hexDataHeader.slice(0, 4).reverse().join("");
    let packageLengthDecimal = hextodecimal(packageLengthHexString);
    return packageLengthDecimal;
});

// firmware version
const firmwareVersion = (hexDataHeader => {

    let firmwareVersionHexString = hexDataHeader.slice(4, 14).join("");
    let firmwareVersionString = hextoascii(firmwareVersionHexString);
    return firmwareVersionString;
});

// device type
const deviceType = (hexDataHeader => {

    let deviceTypeHexString = hexDataHeader.slice(14, 15).join("");
    let deviceTypeDecimal = hextodecimal(deviceTypeHexString);
    return deviceTypeDecimal;
});

// device id
const deviceID = (hexDataHeader => {

    let deviceIDHexString = hexDataHeader.slice(15, 19).reverse().join("");
    let deviceIDDecimal = hextodecimal(deviceIDHexString);
    return deviceIDDecimal;
});

// patient ID
const patientID = (hexDataHeader => {

    let patientIDHexString = hexDataHeader.slice(19, 37).join("");
    let patientIDString = hextoascii(patientIDHexString);
    return patientIDString;
});

// date
const date = (hexDataHeader => {

    let dateHexString = hexDataHeader.slice(37, 43)
    let date = dateFunc(dateHexString);
    return date;
});

// test type
const testType = (hexDataHeader => {

    let testTypeHexString = hexDataHeader.slice(43, 44).join("");
    let testTypeDecimal = hextodecimal(testTypeHexString);
    return testTypeDecimal;
});

// sampling frequency
const samplingFrequency = (hexDataHeader => {

    let samplingFrequencyHexString = hexDataHeader.slice(44, 46).reverse().join("");
    let samplingFrequencyDecimal = hextodecimal(samplingFrequencyHexString);
    return samplingFrequencyDecimal;
});

// number of samples
const numberOfSamples = (hexDataHeader => {

    let numberOfSamplesHexString = hexDataHeader.slice(46, 50).reverse().join("");
    let numberOfSamplesDecimal = hextodecimal(numberOfSamplesHexString);
    return numberOfSamplesDecimal;
});


// BP calculated data
const bpCalculatedData = (hexDataHeader => {

    let calculatedDataHexString = hexDataHeader.slice(50, 54).reverse();
    let calculatedData = calcDataFunc(calculatedDataHexString);
    return calculatedData;
});


// ECG, BG, SPO2 calculated data
const calculatedData = (hexDataHeader => {

    let calculatedDataHexString = hexDataHeader.slice(50, 54).reverse().join("");
    let calculatedData = hextodecimal(calculatedDataHexString);
    return calculatedData;
});


// Body Temp calculated data
const bodyTempCalculatedData = (hexDataHeader => {
  
    //Calculated data
   // let calculatedDataHexString = hexDataHeader.slice(50, 54).reverse().join("")
    //42 c3 0 0
    //let calculatedDataHexString = 
   // let calcHexStr = '0x' + calculatedDataHexString + '00';

    let calculatedData = hexToFloat('0x42a26666')

    return calculatedData;
});


//hex to float conversion
const hexToFloat = (str) => {
// 0x42c30000
    var float = 0, sign, order, mantissa, exp,
        int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str, 16);

    }
    else {
        for (var i = str.length - 1; i >= 0; i -= 1) {
            if (str.charCodeAt(i) > 255) {
                console.log('Wrong string parameter');
                return false;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int >>> 31) ? -1 : 1;
    exp = (int >>> 23 & 0xff) - 127;
    mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i = 0; i < mantissa.length; i += 1) {
        float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
        exp--;
    }
    return float * sign;
}



module.exports.hexExtraction = (hexDataHeader, context) => {
   

    let extractedData = {}

    // package length.
    extractedData.packageLength = packageLength(hexDataHeader)

    //firmware version.
    extractedData.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    extractedData.deviceType = deviceType(hexDataHeader)

    //device ID
    extractedData.deviceID = deviceID(hexDataHeader);

    //patient ID
    extractedData.patientID = patientID(hexDataHeader);

    //date and time
    extractedData.date = date(hexDataHeader);

    //test type
    extractedData.testType = testType(hexDataHeader);

    //sampling frequency
    extractedData.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    extractedData.numberOfSamples = numberOfSamples(hexDataHeader);

    if (context === 'BP') {

        //Calculated data
        extractedData.calculatedData = bpCalculatedData(hexDataHeader);

    } else if (context === 'ECG' || context === 'BG' || context === 'SPO2') {

        //Calculated data
        extractedData.calculatedData = calculatedData(hexDataHeader);

    } else if (context === 'Body_Temp') {

        //Calculated data
        extractedData.calculatedData = bodyTempCalculatedData(hexDataHeader);

    } else {
        extractedData.calculatedData = null;
    }

    return extractedData;

}