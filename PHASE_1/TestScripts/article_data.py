import datetime

data = [{
        "url": "https://www.cdc.gov/vhf/ebola/outbreaks/drc/2021-oct.html",
        "date_of_publication": "2021-01-01 17:00:00",
        "headline": "October 2021 Democratic Republic of the Congo, North Kivu Province",
        "main_text": "Sequencing data from the first confirmed case in this outbreak showed a link to the 2018-2020 outbreak in the same region. This link suggests that this outbreak was likely caused by a persistent infection in an EVD survivor that led to either a relapse or sexual transmission of the virus.",
        "reports": [{
            "diseases": ["ebola"],
            "syndromes": [],
            "event_date": (datetime.datetime.strptime('2021-08-08T19:37:12', '%Y-%m-%dT%H:%M:%S'), None),
            "locations": [{
                "country": "Democratic Republic of the Congo",
                "location": "North Kivu Province"
            }]
        }]
    },
    {
        "url": "https://www.cdc.gov/listeria/outbreaks/delimeat-10-20/index.html",
        "date_of_publication": "2021-01-28 17:00:00",
        "headline": "Outbreak of Listeria Infections Linked to Deli Meats",
        "main_text": "CDC, public health and regulatory officials in several states, and the U.S. Department of Agriculture’s Food Safety and Inspection Service (USDA-FSIS) investigated a multistate outbreak of Listeria monocytogenes infections linked to deli meats.",
        "reports": [{
            "diseases": ["listeria"],
            "syndromes": [],
            "event_date": (datetime.datetime.strptime('2021-01-28T00:00:00', '%Y-%m-%dT%H:%M:%S'), None),
            "locations": [{
                "country": "US",
                "location": "Florida"
            }]
        }]
    },
    {
        "url": "https://www.cdc.gov/mmwr/volumes/68/wr/mm6819a5.htm",
        "date_of_publication": "2019-05-17 00:00:00",
        "headline": "Notes from the Field: Community Outbreak of Measles — Clark County, Washington, 2018–2019",
        "main_text": "On December 31, 2018, Clark County Public Health (CCPH) in Washington was notified of a suspected case of measles in an unvaccinated child, aged 10 years, who had recently arrived from Ukraine. The patient was evaluated at an urgent care clinic for fever, cough, and a maculopapular rash. CCPH launched a case investigation, conducted contact tracing, and facilitated specimen collection and shipment to the Washington State Department of Health Public Health Laboratories. On January 3, 2019, measles virus was detected in the patient’s urine and nasopharyngeal specimens by reverse transcription–polymerase chain reaction (RT-PCR). By January 16, among 12 patients with suspected measles reported to CCPH during January 11–14, all had laboratory-confirmed measles by RT-PCR. In response to these confirmed cases and additional suspected cases, CCPH’s Incident Management Team was activated on January 15. Approximately 200 persons participated in the multiagency response, which included CCPH, the Washington State Department of Health, and CDC. As of March 28, 2019, measles had been confirmed among 71 Clark County residents, with rash onsets from December 30, 2018, to March 13, 2019.",
        "reports": [{
            "diseases": ["measles"],
            "syndromes": [],
            "event_date": (datetime.datetime.strptime('2018-12-31T00:00:00', '%Y-%m-%dT%H:%M:%S'), datetime.datetime.strptime('2018-12-31T00:00:00', '%Y-%m-%dT%H:%M:%S')),
            "locations": [{
                "country": "US",
                "location": "Clark County, Washington"
            }]
        }]
    },
    {
        "url": "https://www.cdc.gov/meningitis/bacterial.html",
        "date_of_publication": "2021-07-15 00:00:00",
        "headline": "Bacterial Meningitis",
        "main_text": "Bacterial meningitis is serious. Some people with the infection die and death can occur in as little as a few hours. However, most people recover from bacterial meningitis. Those who do recover can have permanent disabilities, such as brain damage, hearing loss, and learning disabilities.",
        "reports": [{
            "diseases": [],
            "syndromes": ["bacterial meningitis"],
            "event_date": (datetime.datetime.strptime('2021-07-15T00:00:00', '%Y-%m-%dT%H:%M:%S'), datetime.datetime.strptime('2021-07-15T00:00:00', '%Y-%m-%dT%H:%M:%S')),
            "locations": [{
                "country": "US",
                "location": "Clark County, Washington"
            }]
        }]
    },
    {
        "url": "https://www.cdc.gov/vhf/ebola/history/2014-2016-outbreak/index.html",
        "date_of_publication": "2019-03-08 00:00:00",
        "headline": "Bacterial Meningitis",
        "main_text": "On March 23, 2014, the World Health Organization (WHO) reported cases of Ebola Virus Disease (EVD) in the forested rural region of southeastern Guinea. The identification of these early cases marked the beginning of the West Africa Ebola epidemic, the largest in history.",
        "reports": [{
            "diseases": ["ebola"],
            "syndromes": [],
            "event_date": (datetime.datetime.strptime('2014-03-23T00:00:00', '%Y-%m-%dT%H:%M:%S'), datetime.datetime.strptime('2016-03-16T00:00:00', '%Y-%m-%dT%H:%M:%S')),
            "locations": [{
                "country": "",
                "location": "West Africa"
            }]
        }]
    }
]