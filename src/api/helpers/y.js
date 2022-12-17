



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
    console.log(first ," == sys");

    let second = calculatedDataHexString.slice(2, 4).join("");
    console.log(second, " == dis");
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
    console.log(hexDataHeader.slice(50, 54).join("")," == actual BP calculated data");
    let calculatedDataHexString = hexDataHeader.slice(50, 54).reverse();
    console.log(calculatedDataHexString, " == reversed ");
    let calculatedData = calcDataFunc(calculatedDataHexString);
    return calculatedData;
});


// ECG calculated data
const ecgCalculatedData = (hexDataHeader => {
    console.log(hexDataHeader.slice(50, 54).join("")," == actual SPO2 calculated data");
    let calculatedDataHexString = hexDataHeader.slice(50, 54).reverse().join("");
    console.log(calculatedDataHexString, " == reversed ");
    let calculatedData = hextodecimal(calculatedDataHexString);
    return calculatedData;
});





// BP extraction from the hex data
module.exports.bpExtraction = (hexDataHeader) => {

    let bpRecord = {}


    // package length.
    bpRecord.packageLength = packageLength(hexDataHeader)

    //firmware version.
    bpRecord.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    bpRecord.deviceType = deviceType(hexDataHeader)

    //device ID
    bpRecord.deviceID = deviceID(hexDataHeader);

    //patient ID
    bpRecord.patientID = patientID(hexDataHeader);

    //date and time
    bpRecord.date = date(hexDataHeader);

    //test type
    bpRecord.testType = testType(hexDataHeader);

    //sampling frequency
    bpRecord.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    bpRecord.numberOfSamples = numberOfSamples(hexDataHeader);

    //Calculated data
    bpRecord.calculatedData = bpCalculatedData(hexDataHeader);


    return bpRecord;
}



// ECG extraction from hex data 
module.exports.ecgExtraction = (hexDataHeader) => {

    let ecgRecord = {};

    // package length.
    ecgRecord.packageLength = packageLength(hexDataHeader)

    //firmware version.
    ecgRecord.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    ecgRecord.deviceType = deviceType(hexDataHeader)

    //device ID
    ecgRecord.deviceID = deviceID(hexDataHeader);

    //patient ID
    ecgRecord.patientID = patientID(hexDataHeader);

    //date and time
    ecgRecord.date = date(hexDataHeader);

    //test type
    ecgRecord.testType = testType(hexDataHeader);

    //sampling frequency
    ecgRecord.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    ecgRecord.numberOfSamples = numberOfSamples(hexDataHeader);

    //Calculated data

    ecgRecord.calculatedData = ecgCalculatedData(hexDataHeader);

    
    return ecgRecord;

}



// Blood Glucose extraction from hex data 
module.exports.bgExtraction = (hexDataHeader) => {

    let bgRecord = {};

    //bp package length.
    bgRecord.packageLength = packageLength(hexDataHeader)

    //firmware version.
    bgRecord.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    bgRecord.deviceType = deviceType(hexDataHeader)

    //device ID
    bgRecord.deviceID = deviceID(hexDataHeader);

    //patient ID
    bgRecord.patientID = patientID(hexDataHeader);

    //date and time
    bgRecord.date = date(hexDataHeader);

    //test type
    bgRecord.testType = testType(hexDataHeader);

    //sampling frequency
    bgRecord.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    bgRecord.numberOfSamples = numberOfSamples(hexDataHeader);

    //Calculated data

    bgRecord.calculatedData = ecgCalculatedData(hexDataHeader);

    
    return bgRecord;

}



// Body Temperature extraction from hex data 
module.exports.bodyTempExtraction = (hexDataHeader) => {

    let bodyTempRecord = {};

    // package length.
    bodyTempRecord.packageLength = packageLength(hexDataHeader)

    //firmware version.
    bodyTempRecord.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    bodyTempRecord.deviceType = deviceType(hexDataHeader)

    //device ID
    bodyTempRecord.deviceID = deviceID(hexDataHeader);

    //patient ID
    bodyTempRecord.patientID = patientID(hexDataHeader);

    //date and time
    bodyTempRecord.date = date(hexDataHeader);

    //test type
    bodyTempRecord.testType = testType(hexDataHeader);

    //sampling frequency
    bodyTempRecord.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    bodyTempRecord.numberOfSamples = numberOfSamples(hexDataHeader);

    //Calculated data

    bodyTempRecord.calculatedData = ecgCalculatedData(hexDataHeader);

    
    return bodyTempRecord;

}



// SPO2/Blood Oxygen extraction from hex data 
module.exports.bloodOxygenExtraction = (hexDataHeader) => {

    let bloodOxygenRecord = {};

    // package length.
    bloodOxygenRecord.packageLength = packageLength(hexDataHeader)

    //firmware version.
    bloodOxygenRecord.firmwareVersion = firmwareVersion(hexDataHeader)

    //device type
    bloodOxygenRecord.deviceType = deviceType(hexDataHeader)

    //device ID
    bloodOxygenRecord.deviceID = deviceID(hexDataHeader);

    //patient ID
    bloodOxygenRecord.patientID = patientID(hexDataHeader);

    //date and time
    bloodOxygenRecord.date = date(hexDataHeader);

    //test type
    bloodOxygenRecord.testType = testType(hexDataHeader);

    //sampling frequency
    bloodOxygenRecord.samplingFrequency = samplingFrequency(hexDataHeader);


    //Number of samples
    bloodOxygenRecord.numberOfSamples = numberOfSamples(hexDataHeader);

    //Calculated data

    bloodOxygenRecord.calculatedData = ecgCalculatedData(hexDataHeader);

    
    return bloodOxygenRecord;

}


