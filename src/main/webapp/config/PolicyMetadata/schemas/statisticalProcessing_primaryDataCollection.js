define({
    //"schemaSource": "./submodules/fenix-ui-metadata-editor/config/schemas/contactsSCH.json",
    //"optionsSource": "./submodules/fenix-ui-metadata-editor/config/schemas/contactsOPTS.json",
    "required": ["dataCollection", "collectionPeriodicity"],
    "schema": {
        "type": "object",
        "properties": {
            "dataCollection": {
                "title": "Data collection",
                "type": "string"
            },
            "collectionPeriodicity": {
                "title": "Periodicity of data collection"
            }
        }
    },
    "options": {
        "fields":
        {
            "dataCollection": {
                "helper": "Methods used to gather data from the respondents (e.g. postal survey, CAPI, on-line survey, face-to-face interviews etc.) and description of data collection methods. This metadata element also includes more precise information about the kind of questionnaire (structured, unstructured etc.) and if necessary somenoteworthy aspects of the data collection process."
            },
            "collectionPeriodicity": {
                "type": "select",
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_FAO_Period.json",
                "helper": "Frequency with which the data are collected from the sources."
            }
        }
    }
});
