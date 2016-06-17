define({
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "dataQuality_compatibilityCoherence",
        "title": "Comparability Coherence",
        "type": "object",
        "properties": {
            "coherenceIntern": {
                "title": "Internal coherence",
                "type": "string"
            }
        }
    },
    "options": {
        "helper": "Degree of data comparability across the geographic areas or regions referenced by the resource. Data might be derived from surveys that in general are conducted by different statistical agencies. These surveys often refer to populations of different geographical areas, sometimes based on different methodologies.",
        "fields": {
            "coherenceIntern": {
                "helper": "General estimate of the extent to which data are consistent within the resource."
            }
        }
    }
});
