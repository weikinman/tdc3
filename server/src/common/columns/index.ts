const ColumnTypes = {
    "NumericTypes": {
        "IntegerTypes": {
            "TINYINT": { "Bytes": 1, "MinValue": "-128", "MaxValue": "127" },
            "SMALLINT": { "Bytes": 2, "MinValue": "-32768", "MaxValue": "32767" },
            "MEDIUMINT": { "Bytes": 3, "MinValue": "-8388608", "MaxValue": "8388607" },
            "INT": { "Bytes": 4, "MinValue": "-2147483648", "MaxValue": "2147483647" },
            "BIGINT": { "Bytes": 8, "MinValue": "-9223372036854775808", "MaxValue": "9223372036854775807" }
        },
        "FloatingPointandDoublePrecision": {
            "FLOAT": { "Precision": "Approx. 7 digits" },
            "DOUBLE": { "Precision": "Approx. 15 digits" },
            "DECIMAL": { "Precision": "Up to 65 digits", "Description": "Can store exact numerical data with up to 65 total digits of precision. Useful for financial calculations where exact decimal representation is required." }
        }
    },
    "DateandTimeTypes": {
        "DATE": { "Format": "YYYY-MM-DD" },
        "DATETIME": { "Format": "YYYY-MM-DD HH:MM:SS" },
        "TIMESTAMP": { "Format": "YYYY-MM-DD HH:MM:SS" },
        "TIME": { "Format": "HH:MM:SS" },
        "YEAR": { "Format": "YYYY" }
    },


    "StringTypes": {
        "TextStrings": {
            "CHAR": { "MaxLength": "255", "Params": "(length)" },
            "VARCHAR": { "MaxLength": "65535", "Params": "(length)" }
        },
        "LongTextData": {
            "TINYTEXT": { "MaxLength": "255" },
            "TEXT": { "MaxLength": "65535" },
            "MEDIUMTEXT": { "MaxLength": "16777215" },
            "LONGTEXT": { "MaxLength": "4294967295" }
        },
        "BinaryStrings": {
            "BINARY": { "MaxLength": "255", "Params": "(length)" },
            "VARBINARY": { "MaxLength": "65535", "Params": "(length)" }
        },
        "LongBinaryData": {
            "TINYBLOB": { "MaxLength": "255" },
            "BLOB": { "MaxLength": "65535" },
            "MEDIUMBLOB": { "MaxLength": "16777215" },
            "LONGBLOB": { "MaxLength": "4294967295" }
        }
    },

    "LogicalTypes": {
        "BOOLEAN": { "Equivalent": "TINYINT(1)" },
        "BOOL": { "Equivalent": "TINYINT(1)" }
    },
    "EnumerationandSetTypes": {
        "ENUM": { "Description": "String object that can have only one value, chosen from a list of predefined values" },
        "SET": { "Description": "String object that can have zero or more values, chosen from a list of predefined values" }
    }
}

type FlatType =  {
    __rootType__?:string,
    __parentType__?:string,
    [index:string|number]:any
}

function getFlatTypes():FlatType{
    let res:FlatType = {};
    Object.keys(ColumnTypes).forEach(item=>{
        Object.keys(ColumnTypes[item]).forEach(key=>{
            res = {...ColumnTypes[item][key]};
            res.__rootType__ = item;
            res.__parentType__ = key;
        })
    })
    return res;
}
class BaseColumn{
    
    private flatTypes_:FlatType;
    
    constructor(){
        this.flatTypes_ = getFlatTypes();
    }

    genColumnStr(type,length?){
        const columnType = this.flatTypes_[type]
        if(!columnType){
            throw new Error('找不到需要創建的字段類型');
        }
        let lengthStr = length && columnType.Params?`(${columnType.Params.replace('length',length)})`:'';
        return ` ${columnType}${lengthStr}`
        
    }
}