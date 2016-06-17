define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "accessibility_dataDissemination_releasePolicy",
        "title": "Release Policy",
        "type": "object",
        "properties": {
            "disseminationPeriodicity": {
                "title": "Dissemination periodicity",
            }
        }
    },
    "options": {
        "fields": {
            "disseminationPeriodicity": {
                "type": "select",
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_FAO_Period.json",
                "helper": "Frequency of data dissemination (e.g. daily, monthly, quarterly, yearly)"
            }
        }
    }
});
