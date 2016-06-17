define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "statisticalProcessing_dataCompilation",
        "title": "Data Compilation",
        "type": "object",
        "description": "This section describes the main statistics actions operated on data (e.g. data editing, imputation, weighting, adjustment for non-response, model used etc.).",
        "properties": {
            "dataAdjustmentDetails": {
                "title": "Details on process of adjustment",
                "type": "string"
            }
        }

    },
    "options": {
        "fields": {
            "dataAdjustmentDetails": {
                "helper": "Set of procedures employed to modify statistical data to enable it to be conform with national or international standards (such as seasonal adjustment methods, time series decomposition, or other similar methods)."
            }
        }
    }


})
