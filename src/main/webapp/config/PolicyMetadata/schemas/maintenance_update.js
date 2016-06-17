define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "maintenance_update",
        "title": "Update",
        "type": "object",
        "properties": {
            "updatePeriodicity": {
                "title": "Frequency of update"
            }
        }
    },
    "options": {
        "helper": "This section involves maintenance operations concerning the periodic update of the resource.",
        "fields": {
            "updatePeriodicity": {
                "helper": "Time span between the completion of the production process of statistical data and their publication.",
                "type": "select",
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_FAO_Period.json"
            }
        }
    }

});
