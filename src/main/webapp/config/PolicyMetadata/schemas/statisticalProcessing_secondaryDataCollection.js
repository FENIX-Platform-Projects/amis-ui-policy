define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "statisticalProcessing_secondaryDataCollection",
        "title": "Secondary Data Collection",
        "type": "object",
        "required": ["dataCollection"],
        "properties": {
            "originOfCollectedData": {
                "title": "Origin of collected data"
            },
            "organization": {
                "title": "Organization",
                "type": "string"
            },
            "dataCollection": {
                "title": "Data collection",
                "type": "string"
            }
        },
        "dependencies": {
            "organization": ["originOfCollectedData"],
        }
    },
    "options": {
        "helper": "This section is filled when the agency compiling and publishing data does not coincide with the entity (subject, agency or institution) who has conducted the procedure of collecting data. It reports information about the source that have already collected data.",
        "fields": {
            "originOfCollectedData": {
                "helper": "Coded element which allows to specify in a standard way the origin of the resource.",
                "removeDefaultNone": false,
                "type": "select",
                "dataSource": "./submodules/fenix-ui-metadata-editor/config/CL/CL_FAOSTAT_OriginData.json"
            },
            "organization": {
                "helper": "Organization is mandatory when 'Other International Organizations' has been chosen in originOfCollectedData *** If the element \u003c\u003coriginOfCollectedData\u003e\u003e has been generally specified as \u0027other International Organizations\u0027 this element requests to report the exact source of the resource.",
                "dependencies": {
                    "originOfCollectedData": "A"
                }
            },
            "dataCollection": {
                "helper": "Data collection details"
            }
        }

    }
});